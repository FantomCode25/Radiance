import { useState } from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const MentalHealthSection = () => {
  const [activeCategory, setActiveCategory] = useState('anxiety');
  
  const categories = [
    { id: 'anxiety', label: 'Anxiety Disorders' },
    { id: 'depression', label: 'Depression' },
    { id: 'trauma', label: 'Trauma & PTSD' },
    { id: 'relationship', label: 'Relationship Issues' },
    { id: 'stress', label: 'Stress Management' },
  ];
  
  const categoryContent = {
    anxiety: {
      title: 'Understanding Anxiety Disorders',
      description: 'Anxiety disorders are characterized by persistent, excessive fear or worry in situations that are not threatening. They affect how we feel and behave and can cause physical symptoms.',
      symptoms: [
        'Excessive worry or fear',
        'Restlessness or feeling on edge',
        'Rapid heartbeat or breathing',
        'Difficulty concentrating',
        'Sleep problems',
      ],
      treatment: 'Anxiety disorders are highly treatable with therapy, medication, or a combination of both. Cognitive Behavioral Therapy (CBT) has been shown to be particularly effective.',
      faqs: [
        {
          question: 'What is the difference between normal anxiety and an anxiety disorder?',
          answer: 'While normal anxiety is an expected response to stress that comes and goes, an anxiety disorder involves persistent worry that interferes with daily activities.'
        },
        {
          question: 'Can anxiety disorders be cured?',
          answer: 'With proper treatment, many people can significantly reduce or even eliminate anxiety symptoms, though some may need ongoing management.'
        },
        {
          question: 'Is medication necessary for treating anxiety?',
          answer: 'Not always. While medication can be helpful, many people effectively manage anxiety with therapy alone or with lifestyle changes.'
        }
      ]
    },
    depression: {
      title: 'Understanding Depression',
      description: "Depression is more than just feeling sad. It's a serious mental health condition that affects how you feel, think, and handle daily activities.",
      symptoms: [
        'Persistent sad or "empty" mood',
        'Loss of interest in activities once enjoyed',
        'Fatigue and decreased energy',
        'Difficulty concentrating or making decisions',
        'Sleep disturbances (insomnia or oversleeping)',
      ],
      treatment: 'Depression is typically treated with psychotherapy, medication, or a combination. Lifestyle changes like regular exercise and good sleep habits can also help.',
      faqs: [
        {
          question: 'Is depression just sadness?',
          answer: "No, depression is much more than sadness. It's a persistent condition that affects mood, thoughts, and physical wellbeing, often without a clear cause."
        },
        {
          question: 'Can depression go away on its own?',
          answer: 'While mild depression might improve without treatment, moderate to severe depression typically requires professional help.'
        },
        {
          question: 'How long does depression treatment take?',
          answer: 'Treatment duration varies by individual. Some people see improvement in a few weeks, while others may need longer-term support.'
        }
      ]
    },
    trauma: {
      title: 'Understanding Trauma & PTSD',
      description: 'Trauma results from experiencing or witnessing a distressing event. Post-Traumatic Stress Disorder (PTSD) develops when trauma symptoms persist and interfere with daily functioning.',
      symptoms: [
        'Intrusive memories or flashbacks',
        'Avoidance of trauma reminders',
        'Negative changes in thinking and mood',
        'Hyperarousal or being easily startled',
        'Sleep disturbances or nightmares',
      ],
      treatment: 'Trauma-focused therapies like EMDR (Eye Movement Desensitization and Reprocessing) and CPT (Cognitive Processing Therapy) are effective in treating trauma and PTSD.',
      faqs: [
        {
          question: 'Can you develop PTSD from non-life-threatening events?',
          answer: 'Yes, PTSD can develop from various traumatic experiences, not just life-threatening ones. What matters is how the event impacted you.'
        },
        {
          question: 'How soon after trauma does PTSD develop?',
          answer: 'PTSD symptoms typically begin within 3 months of a traumatic incident, but sometimes they begin years afterward.'
        },
        {
          question: 'Is PTSD permanent?',
          answer: 'No, with appropriate treatment, most people with PTSD experience significant improvement and some recover completely.'
        }
      ]
    },
    relationship: {
      title: 'Understanding Relationship Issues',
      description: 'Relationship difficulties can arise from communication problems, trust issues, life transitions, or differing expectations. These challenges can affect mental wellbeing significantly.',
      symptoms: [
        'Persistent conflict or arguments',
        'Feeling disconnected or distant',
        'Trust issues or jealousy',
        'Communication breakdowns',
        'Dissatisfaction or resentment',
      ],
      treatment: 'Relationship counseling or couples therapy can help identify patterns, improve communication, and develop healthier relationship dynamics.',
      faqs: [
        {
          question: 'When should couples seek therapy?',
          answer: 'Couples should consider therapy whenever relationship issues are causing significant distress or when they find themselves unable to resolve conflicts effectively.'
        },
        {
          question: 'Can individual therapy help with relationship problems?',
          answer: 'Yes, individual therapy can help you understand your patterns and behaviors in relationships, even if your partner doesn\'t participate.'
        },
        {
          question: 'How long does relationship counseling typically take?',
          answer: 'This varies widely, but many couples see improvement within 8-20 sessions, depending on the issues addressed.'
        }
      ]
    },
    stress: {
      title: 'Understanding Stress Management',
      description: 'While stress is a normal part of life, chronic stress can impact physical and mental health. Effective stress management involves identifying stressors and developing coping strategies.',
      symptoms: [
        'Feeling overwhelmed or irritable',
        'Difficulty relaxing or quieting the mind',
        'Physical symptoms like headaches or muscle tension',
        'Changes in appetite or sleep patterns',
        'Decreased productivity or motivation',
      ],
      treatment: 'Stress management techniques include mindfulness practices, exercise, time management strategies, and sometimes therapy to develop personalized coping skills.',
      faqs: [
        {
          question: 'Is all stress bad for you?',
          answer: "No, short-term stress can actually be motivating. It's chronic, unmanaged stress that negatively impacts health."
        },
        {
          question: 'Can stress cause physical illness?',
          answer: 'Yes, chronic stress is linked to numerous physical health problems including heart disease, digestive issues, and weakened immunity.'
        },
        {
          question: 'What\'s the quickest way to reduce stress in the moment?',
          answer: 'Deep breathing exercises, brief mindfulness practices, or short walks can help reduce stress quickly in the moment.'
        }
      ]
    }
  };
  
  const content = categoryContent[activeCategory];

  return (
    <section className="py-16 bg-gray-50" id="mental-health-section">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-oasis-dark">Know About Mental Health</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Understanding mental health conditions is the first step toward healing
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories sidebar */}
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible space-x-4 lg:space-x-0 lg:space-y-2 pb-4 lg:pb-0">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-3 rounded-lg text-left whitespace-nowrap lg:whitespace-normal ${
                  activeCategory === category.id
                    ? 'bg-oasis-primary text-white'
                    : 'bg-white hover:bg-gray-100 text-gray-700'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
          
          {/* Content area */}
          <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow">
            <h3 className="text-2xl font-semibold text-oasis-primary mb-4">{content.title}</h3>
            <p className="text-gray-700 mb-6">{content.description}</p>
            
            <div className="mb-6">
              <h4 className="text-lg font-medium text-oasis-dark mb-3">Common Symptoms</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {content.symptoms.map((symptom, index) => (
                  <li key={index}>{symptom}</li>
                ))}
              </ul>
            </div>
            
            <div className="mb-6">
              <h4 className="text-lg font-medium text-oasis-dark mb-3">Treatment Approaches</h4>
              <p className="text-gray-700">{content.treatment}</p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-oasis-dark mb-3">Frequently Asked Questions</h4>
              <Accordion type="single" collapsible className="w-full">
                {content.faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-gray-800 hover:text-oasis-primary">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MentalHealthSection;
