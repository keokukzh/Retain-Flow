'use client';

import React, { useRef, useEffect } from 'react';

interface P5AnimatedHeaderProps {
  className?: string;
}

export default function P5AnimatedHeader({ className = '' }: P5AnimatedHeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js';
    
    script.onload = () => {
      const sketch = (p: any) => {
        let pullCord: PullCord;
        let isDarkTheme = false;
        
        p.setup = () => {
          p.createCanvas(400, 100);
          pullCord = new PullCord(p, p.width / 2, 20);
        };

        p.draw = () => {
          p.background(0, 0, 0, 0); // Transparent background
          
          // Update physics
          pullCord.update();
          pullCord.display();
          
          // Check for theme toggle
          if (pullCord.isPulledDown()) {
            isDarkTheme = !isDarkTheme;
            pullCord.reset();
            // Theme toggle logic would go here
          }
        };

        p.mousePressed = () => {
          pullCord.startPull(p.mouseX, p.mouseY);
        };

        p.mouseDragged = () => {
          pullCord.updatePull(p.mouseX, p.mouseY);
        };

        p.mouseReleased = () => {
          pullCord.endPull();
        };
      };
      
      p5InstanceRef.current = new (window as any).p5(sketch, containerRef.current);
    };
    
    document.head.appendChild(script);
    
    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
      }
    };
  }, []);

  return <div ref={containerRef} className={className} />;
}

class PullCord {
  private p: any;
  private anchor: any;
  private bob: any;
  private restLength: number;
  private gravity: any;
  private stiffness: number;
  private damping: number;
  private pullThreshold: number;
  private isPulling: boolean;
  private pullStartY: number;

  constructor(p: any, x: number, y: number) {
    this.p = p;
    this.anchor = p.createVector(x, y);
    this.bob = p.createVector(x, y + 50);
    this.restLength = 50;
    this.gravity = p.createVector(0, 0.6); // Stärkere Gravitation
    this.stiffness = 0.12; // Weichere Feder
    this.damping = 0.94; // Mehr Dämpfung für realistisches Schwingen
    this.pullThreshold = this.restLength * 1.8; // Längerer Zug nötig
    this.isPulling = false;
    this.pullStartY = 0;
  }

  update() {
    if (!this.isPulling) {
      // Apply gravity
      this.bob.add(this.gravity);
      
      // Calculate spring force
      const force = this.p.createVector(this.bob.x - this.anchor.x, this.bob.y - this.anchor.y);
      const currentLength = force.mag();
      const stretch = currentLength - this.restLength;
      
      force.normalize();
      force.mult(-this.stiffness * stretch);
      
      // Apply spring force
      this.bob.add(force);
      
      // Apply damping
      this.bob.mult(this.damping);
    }
  }

  display() {
    // Draw cord
    this.p.stroke(255, 255, 255, 200);
    this.p.strokeWeight(2);
    this.p.line(this.anchor.x, this.anchor.y, this.bob.x, this.bob.y);
    
    // Draw bob (logo area)
    this.p.fill(147, 51, 234, 200);
    this.p.noStroke();
    this.p.ellipse(this.bob.x, this.bob.y, 30, 30);
    
    // Draw "AIDEVELO.AI" text
    this.p.fill(255);
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.textSize(8);
    this.p.text("AIDEVELO.AI", this.bob.x, this.bob.y);
  }

  startPull(x: number, y: number) {
    const distance = this.p.dist(x, y, this.bob.x, this.bob.y);
    if (distance < 20) {
      this.isPulling = true;
      this.pullStartY = this.bob.y;
    }
  }

  updatePull(x: number, y: number) {
    if (this.isPulling) {
      this.bob.y = y;
    }
  }

  endPull() {
    this.isPulling = false;
  }

  isPulledDown(): boolean {
    return this.bob.y - this.pullStartY > this.pullThreshold;
  }

  reset() {
    this.bob.y = this.anchor.y + this.restLength;
    this.pullStartY = this.bob.y;
  }
}
