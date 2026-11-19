import { Hero } from "../components/Hero";
import { SectionMission } from "../components/SectionMission";
import { SectionGinger } from "../components/SectionGinger";
import { SectionPillars } from "../components/SectionPillars";
import { SectionRegion } from "../components/SectionRegion";
import { SectionContact } from "../components/SectionContact";

export function Home() {
  return (
    <>
      <Hero />
      <SectionMission />
      <SectionGinger />
      <SectionPillars />
      <SectionRegion />
      <SectionContact />
    </>
  );
}
