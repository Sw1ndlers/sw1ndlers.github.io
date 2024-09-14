"use client";

import "@styles/radialGradient.css";

const characters = [
	// "A",
	// "B",
	// "C",
	// "D",
	// "E",
	// "F",
	// "G",
	// "H",
	// "I",
	// "J",
	// "K",
	// "L",
	// "M",
	// "N",
	// "O",
	// "P",
	// "Q",
	// "R",
	// "S",
	// "T",
	// "U",
	// "V",
	// "W",
	// "X",
	// "Y",
	"Z",
	"a",
	"b",
	"c",
	"d",
	"e",
	"f",
	"g",
	"h",
	"i",
	"j",
	"k",
	"l",
	"m",
	"n",
	"o",
	"p",
	"q",
	"r",
	"s",
	"t",
	"u",
	"v",
	"w",
	"x",
	"y",
	"z",
	// "0",
	// "1",
	// "2",
	// "3",
	// "4",
	// "5",
	// "6",
	// "7",
	// "8",
	// "9",
];

const characterWidth = 18.38;
const characterHeight = 36;
const changeTextInterval = 20;

import useWindowSize from "@/lib/hooks/useWindowSize";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

function getRandomCharacter() {
	return characters[Math.floor(Math.random() * characters.length)];
}

function AppearingText({
	text,
	className,
	startDelay,
}: {
	text: string;
	className?: string;
	startDelay?: number;
}) {
	const [currentText, setCurrentText] = useState<string[]>([]);
	// const [classNameDelayState, setClassNameDelayState] = useState<string>("");
	const timePerCharacter = 150;

	// useEffect(() => {
	// 	if (!classNameDelay || !delayedClassName) return;

	// 	async function sleep(ms: number) {
	// 		return new Promise((resolve) => setTimeout(resolve, ms));
	// 	}

	// 	sleep(classNameDelay).then(() => {
	// 		setClassNameDelayState(delayedClassName);
	// 	});
	// }, []);

	useEffect(() => {
		const start = Date.now();

		text.split("").forEach((char, index) => {
			currentText.push(char);
		});

		const interval = setInterval(() => {
			const elapsed = Date.now() - start - (startDelay || 0);
			const charIndex = Math.floor(elapsed / timePerCharacter);

			currentText.map((_char, index) => {
				if (charIndex > index) {
					currentText[index] = text[index];

					if (index === text.length - 1) {
						clearInterval(interval);
					}
				} else {
					currentText[index] = getRandomCharacter();
				}
			});
		}, changeTextInterval);

		return () => {
			clearInterval(interval);
		};
	}, []);

	return (
		<p className={cn(`bg-background w-max`, className ?? "")}>
			{currentText}
		</p>
	);
}

export default function Home() {
	const [text, setText] = useState<string>("");
	const windowSize = useWindowSize();

	const [charAmount, setCharAmount] = useState({
		horizontal: 0,
		vertical: 0,
	});

	useEffect(() => {
		if (!windowSize.width || !windowSize.height) {
			return;
		}

		const charAmountVertical = Math.ceil(
			windowSize.height / characterHeight,
		);
		const charAmountHorizontal =
			Math.ceil(windowSize.width / characterWidth) + characterWidth;

		setCharAmount({
			horizontal: charAmountHorizontal,
			vertical: charAmountVertical,
		});

		const interval = setInterval(() => {
			let assembedText = "";

			for (
				let i = 0;
				i < charAmountHorizontal * charAmountVertical;
				i++
			) {
				assembedText += getRandomCharacter();
			}

			setText(assembedText);
		}, changeTextInterval);

		return () => {
			clearInterval(interval);
		};
	}, [windowSize]);

	function getHorizontalTextOffset(percentage: number, textLength: number) {
		// percentage is the percentage of the screen width the text should be offset
		// eg 3 would be 1/3 of the screen width, 2 would be 1/2 of the screen width

		let offset =
			Math.floor(charAmount.horizontal / percentage) -
			Math.floor(textLength);

		if (offset < 1) {
			offset = 1; // Always have at least 1 character of padding
		}

		return characterWidth * offset;
	}

	function getVerticalTextOffset(percentage: number, textLength: number) {
		let offset =
			Math.floor(charAmount.vertical / percentage) -
			Math.floor(textLength / 2);

		if (offset == 0) {
			offset = 1;
		}

		return characterHeight;
	}

	// console.log(getHorizontalTextOffset(3.2, 13));

    if (!windowSize.width || !windowSize.height) {
        return null;
    }

	return (
		<>
			<div className="w-screen h-screen overflow-hidden absolute -z-10">
				<p
					className="text-3xl text-accent/25 text-wrap h-screen break-words radial-gradient"
					style={{
						width: `calc(100vw + ${characterWidth}px)`,
						// background: `radial-gradient(circle 350px at left 60% top 60%, rgba(96, 165, 250, 0.6), hsl(var(--background)))`,
						backgroundClip: "text",
					}}
				>
					{text}
				</p>
			</div>

			<div
				className="text-3xl bg-none flex flex-col"
				style={{
					paddingTop: `${characterHeight * (windowSize.width > 500 ? 5 : 4)}px`,
					paddingLeft: `${getHorizontalTextOffset(3.2, 13)}px`,
				}}
			>
				{/* <p className="bg-background">Hey, Im Alex</p> */}
				<AppearingText
					text="Hey, I'm Alex"
					className="text-blue-200"
					startDelay={100}
				/>

				<span style={{ height: `${characterHeight}px` }} />

				<AppearingText
					text="Projects"
					className="animate-fade animate-delay-[2000ms] animate-duration-300"
					startDelay={2000}
				/>
				<AppearingText
					text="About"
					className="animate-fade animate-delay-[2500ms]"
					startDelay={2500}
				/>
				<AppearingText
					text="Contact"
					className="animate-fade animate-delay-[3000ms]"
					startDelay={3000}
				/>
			</div>
		</>
	);
}
