import { useRef, useEffect } from "react";

// Reference from https://stackoverflow.com/questions/56153797/horizontal-scrolling-on-react-component-using-vertical-mouse-wheel
function HorizontalScroll() {
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
    }, []);
    return pRef;
}

export default HorizontalScroll;