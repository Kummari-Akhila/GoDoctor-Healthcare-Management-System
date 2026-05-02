import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

const ParticleBackground = ({ className = '' }) => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className={`absolute inset-0 ${className}`}
      options={{
        background: {
          color: {
            value: 'transparent'
          }
        },
        fpsLimit: 60,
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: ['#38bdf8', '#8b5cf6', '#ec4899'],
            animation: {
              enable: true,
              speed: 20,
              sync: false
            }
          },
          shape: {
            type: 'circle'
          },
          opacity: {
            value: {
              min: 0.3,
              max: 0.7
            },
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0.3,
              sync: false
            }
          },
          size: {
            value: {
              min: 1,
              max: 3
            },
            animation: {
              enable: false,
              speed: 40,
              minimumValue: 0.1,
              sync: false
            }
          },
          move: {
            enable: true,
            speed: {
              min: 0.5,
              max: 1.5
            },
            direction: 'none',
            random: false,
            straight: false,
            outModes: 'bounce'
          },
          links: {
            enable: true,
            distance: 150,
            color: '#38bdf8',
            opacity: 0.2,
            width: 1,
            triangles: {
              enable: false,
              frequency: 5
            }
          }
        },
        interactivity: {
          detectsOn: 'canvas',
          events: {
            onHover: {
              enable: true,
              mode: 'repulse',
              parallax: {
                enable: false,
                force: 60,
                smooth: 10
              }
            },
            onClick: {
              enable: false,
              mode: 'push'
            },
            resize: true
          },
          modes: {
            repulse: {
              distance: 100,
              duration: 0.4
            },
            push: {
              quantity: 4
            },
            attract: {
              distance: 200,
              duration: 0.4
            }
          }
        },
        detectRetina: true
      }}
    />
  );
};

export default ParticleBackground;
