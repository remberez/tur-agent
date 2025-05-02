import React from 'react';

const reasons = [
  {
    title: 'Надёжность',
    description: 'Более 10 лет опыта на рынке туризма и тысячи довольных клиентов.',
  },
  {
    title: 'Широкий выбор',
    description: 'Более 500 направлений и эксклюзивные туры по всему миру.',
  },
  {
    title: 'Поддержка 24/7',
    description: 'Наша команда всегда готова помочь вам в любое время суток.',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Почему выбирают нас</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="p-6 border rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-blue-600 mb-2">{reason.title}</h3>
              <p className="text-gray-600">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
