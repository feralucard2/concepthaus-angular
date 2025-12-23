export interface DataInterface {
  title1: string;
  title2: string;
  title3: string;
  title4: string;
}

export interface RootInterface {
  menus: Menus;
  section1: Section1;
  section2: Section2;
  section3: Section3;
  section4: Section4;
  form: Form;
  footer: Footer;
  aboutTitle: string;
  aboutTitle2: string;
  aboutsubTitle2: string;
  aboutfotterTitle2: string;
  aboutNumberCoworkers: string;
  aboutNumberProyects: string;
  aboutNumberClients: string;
  thanksTitle: string;
  thanksTitle2: string;
  thanksTitle3: string;
  titleThankYouHeader: string;
}

export interface Menus {
  title1: string;
  title2: string;
  title3: string;
  title4: string;
}

export interface Section1 {
  title: string;
  title2: string;
  title3: string;
  button: string;
}

export interface Section2 {
  title: string;
  carouselClientes: CarouselCliente[];
}

export interface CarouselCliente {
  src: string;
  srcMovil: string;
  alt: string;
  title: string;
  status: boolean;
}

export interface Section3 {
  title: string;
  testimonials: Testimonial[];
}

export interface Testimonial {
  testimonial3: TestimonialItem[];
  status: boolean;
}

export interface TestimonialItem {
  quote: string;
  description: string;
  author: string;
  position: string;
  status: boolean;
}

export interface Section4 {
  title: string;
  services: Service[];
}

export interface Service {
  title: string;
  description: string;
  img: string;
  status: boolean;
}

export interface Form {
  title: string;
  name: string;
  email: string;
  number: string;
  business: FormOptions;
  help: FormOptions;
  button: string;
}

export interface FormOptions {
  title: string;
  options: Option[];
}

export interface Option {
  value: string;
  label: string;
}

export interface Footer {
  title1: string;
  title2: string;
  text1: string;
  text2: string;
  text3: string;
}

