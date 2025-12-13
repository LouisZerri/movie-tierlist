import React from "react";

interface YearSliderProps {
    years: number[];
    selected: number | null;
    onChange: (year: number) => void;
}

const YearSlider: React.FC<YearSliderProps> = ({ years, selected, onChange }) => {
    if (years.length === 0) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(parseInt(e.target.value));
    };

    return (
        <div className="flex flex-col items-end mb-6">
            <label className="mb-1 text-white">📅 Année : {selected ?? "–"}</label>
            <input
                type="range"
                min={Math.min(...years)}
                max={Math.max(...years)}
                step={1}
                value={selected ?? 0}
                onChange={handleChange}
                className="w-[40rem] accent-blue-500"
                list="year-ticks"
            />
            <datalist id="year-ticks">
                {years.filter((_, i) => i % 2 === 0).map((y) => (
                    <option key={y} value={y} label={`${y}`} />
                ))}
            </datalist>
        </div>
    );
};

export default YearSlider;
