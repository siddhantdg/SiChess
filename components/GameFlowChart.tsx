import React, { useMemo } from 'react';
import { MoveAnalysis } from '../types';

interface GameFlowChartProps {
    analysisDetails: (MoveAnalysis | null)[];
}

const SVG_WIDTH = 400;
const SVG_HEIGHT = 80;
const MAX_EVAL = 8; // Max pawn advantage to display (+/- 8)

const generatePathData = (data: number[]) => {
    if (data.length === 0) {
        return { linePath: '', fillPath: '' };
    }

    const centerY = SVG_HEIGHT / 2;
    const xScale = SVG_WIDTH / (data.length > 1 ? data.length - 1 : 1);
    const yScale = centerY / MAX_EVAL;

    const points = data.map((d, i) => {
        const x = i * xScale;
        // Clamp evaluation to prevent going off-screen
        const clampedEval = Math.max(-MAX_EVAL, Math.min(MAX_EVAL, d));
        const y = centerY - clampedEval * yScale;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' L ');

    const linePath = `M ${points}`;
    
    // This path represents the area between the evaluation line and the center line.
    const startX = data.length > 1 ? 0 : SVG_WIDTH / 2;
    const endX = data.length > 1 ? SVG_WIDTH : SVG_WIDTH / 2;
    const fillPath = `M ${startX},${centerY} L ${points} L ${endX},${centerY} Z`;

    return { linePath, fillPath };
};


export const GameFlowChart: React.FC<GameFlowChartProps> = ({ analysisDetails }) => {
    const evaluationData = useMemo(() => {
        if (!analysisDetails || analysisDetails.length <= 1) {
            return [0]; // Start at 0 if no moves
        }
        
        // The graph represents the evaluation at each point in the game.
        // We start at 0 for the initial position.
        const data: number[] = [0];

        // Then we add the evaluation AFTER each move from the analysis details.
        analysisDetails.slice(1).forEach(detail => {
            if (detail) {
                data.push(detail.evalAfter);
            }
        });
        
        return data;
    }, [analysisDetails]);

    const { linePath, fillPath } = generatePathData(evaluationData);

    const clipPathIdWhite = "clipWhiteAdvantage";
    const clipPathIdBlack = "clipBlackAdvantage";
    
    // Colors from the provided image
    const whiteColor = "#F2F2F2";
    const blackColor = "#7D7D7D";
    const centerLineColor = "#5A5A5C";
    const whiteFillColor = "rgba(239, 239, 239, 0.6)";
    const blackFillColor = "rgba(115, 115, 115, 0.6)";

    return (
        <div className="relative">
            <div className="relative z-10 bg-[#303030] rounded-xl overflow-hidden">
                 <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 border-l border-dashed border-[#5A5A5C]"></div>
                 <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-auto" preserveAspectRatio="none">
                    <defs>
                        <clipPath id={clipPathIdWhite}>
                            {/* Clip to the area ABOVE the center line (White's advantage) */}
                            <rect x="0" y="0" width={SVG_WIDTH} height={SVG_HEIGHT / 2} />
                        </clipPath>
                        <clipPath id={clipPathIdBlack}>
                            {/* Clip to the area BELOW the center line (Black's advantage) */}
                            <rect x="0" y={SVG_HEIGHT / 2} width={SVG_WIDTH} height={SVG_HEIGHT / 2} />
                        </clipPath>
                    </defs>

                    {/* Center line */}
                    <line 
                        x1="0" 
                        y1={SVG_HEIGHT / 2} 
                        x2={SVG_WIDTH} 
                        y2={SVG_HEIGHT / 2} 
                        stroke={centerLineColor}
                        strokeWidth="1" 
                    />
                    
                    {/* White's advantage fill (light color) */}
                    <path 
                        d={fillPath}
                        fill={whiteFillColor}
                        clipPath={`url(#${clipPathIdWhite})`}
                    />

                    {/* Black's advantage fill (darker color) */}
                    <path 
                        d={fillPath}
                        fill={blackFillColor}
                        clipPath={`url(#${clipPathIdBlack})`}
                    />

                    {/* White's advantage line */}
                    <path 
                        d={linePath}
                        stroke={whiteColor}
                        strokeWidth="1.8"
                        fill="none"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        clipPath={`url(#${clipPathIdWhite})`}
                    />

                    {/* Black's advantage line */}
                    <path 
                        d={linePath}
                        stroke={blackColor}
                        strokeWidth="1.8"
                        fill="none"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        clipPath={`url(#${clipPathIdBlack})`}
                    />
                </svg>
            </div>
            
            <div className="relative bg-[#E6E6E6] flex justify-between items-end px-3 pt-5 pb-1 rounded-xl -mt-4">
                <span className="text-[#565656] text-xs font-bold tracking-widest">START</span>
                <span className="absolute left-1/2 -translate-x-1/2 bottom-1 text-[#565656] text-xs font-bold tracking-widest">MID</span>
                <span className="text-[#565656] text-xs font-bold tracking-widest">END</span>
            </div>
        </div>
    );
};