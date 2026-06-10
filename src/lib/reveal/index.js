import React, {
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

const DEFAULT_DURATION = 1000;
const DEFAULT_DISTANCE = "20px";

const resolveDistance = distance => {
  if (typeof distance === "number") {
    return `${distance}px`;
  }

  return distance || DEFAULT_DISTANCE;
};

const getOffsetTransform = ({left, right, top, bottom, distance}) => {
  const normalizedDistance = resolveDistance(distance);
  const offsetX = left
    ? `-${normalizedDistance}`
    : right
    ? normalizedDistance
    : 0;
  const offsetY = top
    ? `-${normalizedDistance}`
    : bottom
    ? normalizedDistance
    : 0;

  return `translate3d(${offsetX}, ${offsetY}, 0)`;
};

const setNodeRef = (ref, node) => {
  if (!ref) {
    return;
  }

  if (typeof ref === "function") {
    ref(node);
    return;
  }

  ref.current = node;
};

const useRevealVisibility = elementRef => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsVisible(true);
      return undefined;
    }

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsVisible(true);
      return undefined;
    }

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return undefined;
    }

    const element = elementRef.current;

    if (!element) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef]);

  return isVisible;
};

const Reveal = ({
  children,
  duration = DEFAULT_DURATION,
  distance = DEFAULT_DISTANCE,
  left,
  right,
  top,
  bottom,
  mode = "fade"
}) => {
  const elementRef = useRef(null);
  const isVisible = useRevealVisibility(elementRef);

  const child = useMemo(() => {
    if (isValidElement(children)) {
      return children;
    }

    return <div>{children}</div>;
  }, [children]);

  const childStyle = child.props.style || {};
  const baseTransform = childStyle.transform || "translate3d(0, 0, 0)";
  const hiddenTransform = [
    getOffsetTransform({left, right, top, bottom, distance}),
    childStyle.transform
  ]
    .filter(Boolean)
    .join(" ");

  const animatedStyle = {
    ...childStyle,
    opacity: mode === "fade" ? (isVisible ? 1 : 0) : childStyle.opacity,
    transform: isVisible ? baseTransform : hiddenTransform,
    transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
    willChange: "opacity, transform"
  };

  return cloneElement(child, {
    ...child.props,
    ref: node => {
      elementRef.current = node;
      setNodeRef(child.ref, node);
    },
    style: animatedStyle
  });
};

export const Fade = props => <Reveal {...props} mode="fade" />;

export const Slide = props => <Reveal {...props} mode="slide" />;

const reveal = {
  Fade,
  Slide
};

export default reveal;
