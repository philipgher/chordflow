"use client";

interface CircleOfFifthsProps {
  selectedChord: string;
  onChordSelect: (chord: string) => void;
}

const CIRCLE_MAJOR = [
  "C",
  "G",
  "D",
  "A",
  "E",
  "B",
  "F#",
  "Db",
  "Ab",
  "Eb",
  "Bb",
  "F",
];
const CIRCLE_MINOR = [
  "Am",
  "Em",
  "Bm",
  "F#m",
  "C#m",
  "G#m",
  "D#m",
  "Bbm",
  "Fm",
  "Cm",
  "Gm",
  "Dm",
];

export function CircleOfFifths({
  selectedChord,
  onChordSelect,
}: CircleOfFifthsProps) {
  const radius = 140;
  const innerRadius = 90;
  const centerX = 180;
  const centerY = 180;

  const getPosition = (index: number, r: number) => {
    const angle = (index * 30 - 90) * (Math.PI / 180);
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    };
  };

  return (
    <div className="p-6">
      <h3 className="font-semibold text-foreground mb-4 text-center">
        Circle of Fifths
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Adjacent chords are harmonically related - perfect for building
        progressions
      </p>

      <div className="flex justify-center">
        <svg width="360" height="360" viewBox="0 0 360 360">
          {/* Background circles */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius + 25}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.1"
            strokeWidth="1"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r={innerRadius - 15}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.1"
            strokeWidth="1"
          />

          {/* Major chords (outer) */}
          {CIRCLE_MAJOR.map((chord, i) => {
            const pos = getPosition(i, radius);
            const isSelected = selectedChord === chord;

            return (
              <g
                key={chord}
                onClick={() => onChordSelect(chord)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={24}
                  className={`
                    transition-all
                    ${
                      isSelected
                        ? "fill-primary"
                        : "fill-secondary hover:fill-muted"
                    }
                  `}
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`text-sm font-bold ${
                    isSelected ? "fill-primary-foreground" : "fill-foreground"
                  }`}
                >
                  {chord}
                </text>
              </g>
            );
          })}

          {/* Minor chords (inner) */}
          {CIRCLE_MINOR.map((chord, i) => {
            const pos = getPosition(i, innerRadius);
            const isSelected = selectedChord === chord;

            return (
              <g
                key={chord}
                onClick={() => onChordSelect(chord)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={18}
                  className={`
                    transition-all
                    ${
                      isSelected
                        ? "fill-primary"
                        : "fill-secondary hover:fill-muted"
                    }
                  `}
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`text-xs font-medium ${
                    isSelected ? "fill-primary-foreground" : "fill-foreground"
                  }`}
                >
                  {chord}
                </text>
              </g>
            );
          })}

          {/* Center label */}
          <text
            x={centerX}
            y={centerY - 8}
            textAnchor="middle"
            className="fill-muted-foreground text-xs"
          >
            Major
          </text>
          <text
            x={centerX}
            y={centerY + 8}
            textAnchor="middle"
            className="fill-muted-foreground text-xs"
          >
            (outer)
          </text>
        </svg>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">
          Move clockwise to go up a fifth (G→D→A). The inner ring shows relative
          minors.
        </p>
      </div>
    </div>
  );
}
