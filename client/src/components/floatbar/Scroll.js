import { useRef, useEffect } from "react";

export default function HorizontalScroll() {
    const pRef = useRef();

    useEffect(() => {
        const pos = pRef.current;
        if (pos) {
            const onWheel = (e) => {
                if (e.deltaY === 0) return;
                e.preventDefault();
                pos.scrollTo({
                    top: 0,
                    left: pos.scrollLeft + e.deltaY,
                    behavior: "smooth"
                })
            };
            pos.addEventListener("wheel", onWheel);
            return () => pos.removeEventListener("wheel", onWheel);
        }
    });
    return pRef;
}
