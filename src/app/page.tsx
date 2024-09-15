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

import useWindowSize, { WindowSize } from "@/lib/hooks/useWindowSize";
import { cn, sleep } from "@/lib/utils";
import { useEffect, useState } from "react";

function getRandomCharacter() {
	return characters[Math.floor(Math.random() * characters.length)];
}

function AppearingText({
	text,
	className,
	textClassName,
	startDelay,
	onClick,
}: {
	text: string;
	className?: string;
	textClassName?: string;
	startDelay?: number;
	onClick?: () => void;
}) {
	const [currentText, setCurrentText] = useState<string[]>([]);
	const timePerCharacter = 80;

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

			setCurrentText([...currentText]);
		}, changeTextInterval);

		return () => {
			clearInterval(interval);
		};
	}, []);

	return (
		<div className={cn("bg-background w-max", className)} onClick={onClick}>
			<p className={textClassName ?? ""}>{currentText}</p>
		</div>
	);
}

function TextBackground({
	windowSize,
	setCharAmount,
}: {
	windowSize: WindowSize;
	setCharAmount: (amount: any) => void;
}) {
	const [text, setText] = useState<string>("");

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
			let totalCharacters = charAmountHorizontal * charAmountVertical;
			let assembedText = "";

			for (let i = 0; i < totalCharacters; i++) {
				assembedText += getRandomCharacter();
			}

			setText(assembedText);
		}, changeTextInterval);

		return () => {
			clearInterval(interval);
		};
	}, [windowSize]);

	return (
		<div className="w-screen h-screen overflow-hidden absolute -z-10">
			<p
				className={`text-3xl text-accent/10 text-wrap h-screen break-words radial-gradient transition-all animate-fade`}
				style={{
					width: `calc(100vw + ${characterWidth}px)`,
					backgroundClip: "text",
				}}
			>
				{text}
			</p>
		</div>
	);
}

function Links({
	windowSize,
	charAmount,
}: {
	windowSize: WindowSize;
	charAmount: any;
}) {
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

	if (!windowSize.width || !windowSize.height) return;

	return (
		<div
			className="text-3xl bg-none flex flex-col"
			style={{
				paddingTop: `${characterHeight * (windowSize.width > 500 ? 5 : 4)}px`,
				paddingLeft: `${getHorizontalTextOffset(3.2, 13)}px`,
			}}
		>
			<AppearingText
				text="Hey, I'm Alex"
				className="text-blue-200 animate-fade transition-all"
				startDelay={100}
			/>

			<span style={{ height: `${characterHeight}px` }} />

			<AppearingText
				text="Projects"
				className="animate-fade animate-delay-[1000ms] transition-all text-foreground"
				textClassName="transition-all hover:brightness-150 duration-200 hover:cursor-pointer"
				startDelay={1200}
			/>
			<AppearingText
				text="About"
				className="animate-fade animate-delay-[1300ms]"
				textClassName="transition-all hover:brightness-150 duration-200 hover:cursor-pointer"
				startDelay={1500}
			/>
			<AppearingText
				text="Contact"
				className="animate-fade animate-delay-[1600ms]"
				textClassName="transition-all hover:brightness-150 duration-200 hover:cursor-pointer"
				startDelay={1800}
			/>
		</div>
	);
}

export default function Home() {
	const windowSize = useWindowSize();

	const [mountLinks, setMountLinks] = useState(false);
	const [transitionPage, setTransitionPage] = useState(false);
	const [charAmount, setCharAmount] = useState({
		horizontal: 0,
		vertical: 0,
	});

	useEffect(() => {
		sleep(1000).then(() => {
			setMountLinks(true);
		});
	}, []);

	return (
		<>
			<div className=" w-screen h-screen absolute  bg-red-500 z-30 -left-full"></div>

			<TextBackground
				windowSize={windowSize}
				setCharAmount={setCharAmount}
			/>

			{mountLinks && (
				<Links windowSize={windowSize} charAmount={charAmount} />
			)}
		</>
	);
}
