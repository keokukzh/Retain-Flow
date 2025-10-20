#!/usr/bin/env node

/**
 * Simple Cloudflare MCP Server using Wrangler CLI
 * This provides basic Cloudflare functionality through MCP
 */

const { spawn } = require('child_process');
const readline = require('readline');

class CloudflareMCPServer {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async runWranglerCommand(args) {
    return new Promise((resolve, reject) => {
      const wrangler = spawn('wrangler', args, { 
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true 
      });

      let stdout = '';
      let stderr = '';

      wrangler.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      wrangler.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      wrangler.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, output: stdout });
        } else {
          reject({ success: false, error: stderr, code });
        }
      });
    });
  }

  async handleRequest(request) {
    try {
      const { method, params } = request;

      switch (method) {
        case 'cloudflare/pages/list':
          const result = await this.runWranglerCommand(['pages', 'project', 'list']);
          return {
            success: true,
            data: result.output
          };

        case 'cloudflare/pages/deploy':
          const deployResult = await this.runWranglerCommand(['pages', 'deploy', '.next', '--project-name=retain-flow']);
          return {
            success: true,
            data: deployResult.output
          };

        case 'cloudflare/account/info':
          const accountInfo = await this.runWranglerCommand(['whoami']);
          return {
            success: true,
            data: accountInfo.output
          };

        default:
          return {
            success: false,
            error: `Unknown method: ${method}`
          };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Unknown error'
      };
    }
  }

  start() {
    console.log('Cloudflare MCP Server started');
    console.log('Available methods:');
    console.log('- cloudflare/pages/list');
    console.log('- cloudflare/pages/deploy');
    console.log('- cloudflare/account/info');
    console.log('');

    this.rl.on('line', async (input) => {
      try {
        const request = JSON.parse(input);
        const response = await this.handleRequest(request);
        console.log(JSON.stringify(response));
      } catch (error) {
        console.log(JSON.stringify({
          success: false,
          error: 'Invalid JSON input'
        }));
      }
    });
  }
}

// Start the server
const server = new CloudflareMCPServer();
server.start();
