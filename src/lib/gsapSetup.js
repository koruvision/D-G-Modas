import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(ScrollTrigger, Flip, MotionPathPlugin, MorphSVGPlugin, DrawSVGPlugin);

export { gsap, ScrollTrigger, Flip, MotionPathPlugin, MorphSVGPlugin, DrawSVGPlugin };
