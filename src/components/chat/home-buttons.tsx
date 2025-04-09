import { Button } from "@/components/ui/button"
import { Microscope, ThermometerSnowflake, BicepsFlexed, FlaskConicalOff } from 'lucide-react'

const buttonData = [
  {
    id: 1,
    text: "Compare DMSO and Glycerol for use in cell preservation.",
    icon: Microscope,
  },
  {
    id: 2,
    text: "What are the toxicity risks of using dextran in long-term cell storage?",
    icon: FlaskConicalOff,
  },
  {
    id: 3,
    text: "How does Methanol affect protein stability during freezing?",
    icon: BicepsFlexed,
  },
  {
    id: 4,
    text: "Which cryoprotectant is best for preserving oocytes at -80°C?",
    icon: ThermometerSnowflake,
  },
];

interface PromptButtonsProps {
  onPromptClick: (prompt: string) => void; // Handler to update AiTextbox value
}

export function PromptButtons({ onPromptClick }: PromptButtonsProps) {
  return (
    <div className="flex flex-wrap gap-4 justify-center mx-6">
        {buttonData.map((item) => (
            <Button
              key={item.id}
              variant="outline"
              className="h-fit w-full max-w-xs cursor-pointer" // Control width for wrapping
              onClick={() => onPromptClick(item.text)}
              asChild
            >
              <div className="flex flex-col justify-start text-center p-4">
                <item.icon className="w-full" />
                <h3 className="text-wrap">
                  {item.text}
                </h3>
              </div>
            </Button>
        ))}
    </div>
  );
}