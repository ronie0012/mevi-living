import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

const ArtisanalIcon = (props: IconProps) => (
  <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g stroke="currentColor" strokeWidth="1">
      <circle cx="35" cy="35" r="34.5" />
      <path d="M25 52C25 41.5 29.5 34.5 35 34.5C40.5 34.5 45 41.5 45 52" />
      <path d="M22 48C22 39 27 31 35 31C43 31 48 39 48 48" />
      <path d="M35 22L40 28L35 34L30 28L35 22Z" />
    </g>
  </svg>
);

const EthicallySourcedIcon = (props: IconProps) => (
  <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g stroke="currentColor" strokeWidth="1">
      <circle cx="35" cy="35" r="34.5" />
      <path d="M25 52H45" />
      <path d="M35 52V22" />
      <path d="M35 21L32 18H38L35 21Z" fill="currentColor"/>
      <path d="M18 28L52 22" />
      <path d="M24 27V38" />
      <path d="M19 45C19 41.6863 21.6863 39 25 39C28.3137 39 31 41.6863 31 45" />
      <path d="M46 23V32" />
      <path d="M41 39C41 35.6863 43.6863 33 47 33C50.3137 33 53 35.6863 53 39" />
    </g>
  </svg>
);

const ConsciouslyPackedIcon = (props: IconProps) => (
  <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g stroke="currentColor" strokeWidth="1">
      <circle cx="35" cy="35" r="34.5" />
      <path d="M19.5 30.5V50.5H50.5V30.5" />
      <path d="M19.5 30.5L35 22.5L50.5 30.5" />
      <path d="M35 22.5V50.5" />
      <path d="M36 38C36 39.6569 34.6569 41 33 41C31.3431 41 30 39.6569 30 38C30 36.3431 33 34 33 34C33 34 36 36.3431 36 38Z" />
      <path d="M33 34V32" />
    </g>
  </svg>
);

const SustainablyMadeIcon = (props: IconProps) => (
  <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g stroke="currentColor" strokeWidth="1">
      <circle cx="35" cy="35" r="34.5" />
      <circle cx="35" cy="35" r="14" />
      <path d="M35 21V49" />
      <path d="M21 35H49" />
      <path d="M25.3282 25.3282C28.8924 28.8924 35.1076 28.8924 38.6718 25.3282" />
      <path d="M44.6718 44.6718C41.1076 41.1076 34.8924 41.1076 31.3282 44.6718" />
       
      <path d="M42 30C42 32.2091 40.2091 34 38 34C35.7909 34 34 32.2091 34 30C34 27.7909 38 25 38 25C38 25 42 27.7909 42 30Z" fill="currentColor"/>
    </g>
  </svg>
);

const valueItems = [
  { icon: <ArtisanalIcon />, text: 'Artisanal' },
  { icon: <EthicallySourcedIcon />, text: 'Ethically sourced' },
  { icon: <ConsciouslyPackedIcon />, text: 'Consciously Packed' },
  { icon: <SustainablyMadeIcon />, text: 'Sustainably Made' },
];

const BrandValues = () => {
  return (
    <section className="bg-background py-16 sm:py-20">
      <div className="container">
        <div className="grid grid-cols-2 gap-y-12 sm:grid-cols-4 sm:gap-x-8">
          {valueItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="text-blue-gray">
                {item.icon}
              </div>
              <h5 className="mt-4 font-body text-sm font-normal text-blue-gray uppercase tracking-widest">
                {item.text}
              </h5>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandValues;