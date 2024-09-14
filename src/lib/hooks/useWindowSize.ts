import { useState, useEffect } from "react";
import { Size } from "../types/size";

type WindowSize = {
    width: number | undefined;
    height: number | undefined;
};

export default function useWindowSize() {
	const [size, setSize] = useState<WindowSize>({
        width: undefined,
        height: undefined,
    });

	useEffect(() => {
        setSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });

		const handleResize = () => {
			setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
		};
        
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);
	return size;
}
