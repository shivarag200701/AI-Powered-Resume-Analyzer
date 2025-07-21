import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionHeader,
} from "./Accordion";
import { ScoreBadgeWithNumber } from "./ScoreBadge";
import ScoreBadge from "./ScoreBadge";
import TipCard, { getIcon } from "./TipCard";

const Details = ({ feedback }: { feedback: Feedback }) => {
  const categories = [
    {
      id: "tone-and-style",
      title: "Tone & Style",
      score: feedback.toneAndStyle.score,
      tips: feedback.toneAndStyle.tips,
    },
    {
      id: "content",
      title: "Content",
      score: feedback.content.score,
      tips: feedback.content.tips,
    },
    {
      id: "structure",
      title: "Structure",
      score: feedback.structure.score,
      tips: feedback.structure.tips,
    },
    {
      id: "skills",
      title: "Skills",
      score: feedback.skills.score,
      tips: feedback.skills.tips,
    },
  ];
  return (
    <div className="bg-white rounded-2xl w-full p-6">
      <Accordion allowMultiple={true} className="space-y-4">
        {categories.map((category) => (
          <AccordionItem key={category.id} id={category.id}>
            <AccordionHeader
              itemId={category.id}
              className="text-xl font-[600] hover:bg-gray-50 rounded-t-lg"
            >
              <div>
                <div className="flex flex-row w-full items-center justify-between gap-4">
                  <h4 className="text-xl font-[600]">{category.title}</h4>
                  <ScoreBadgeWithNumber score={category.score} />
                </div>
              </div>
            </AccordionHeader>
            <AccordionContent itemId={category.id} className="text-gray-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 shadow-md rounded-lg p-4 my-4 bg-gray-50">
                {category.tips.map((tip, index) => (
                  <div key={index} className="flex flex-row gap-2">
                    {getIcon(tip.type)}
                    <p className="text-sm">{tip.tip}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-4">
                {category.tips.map((tip, index) => (
                  <div key={index} className="flex flex-row gap-2">
                    <TipCard tip={tip} />
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Details;
