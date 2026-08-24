export const categoryIcons = {
  outdoor: '🌿',
  sofas: '🛋️',
  armchair: '💺',
  tables: '🪑',
  chairs: '🪜',
  bedroom: '🛏️',
  cabinets: '🗄️',
  lighting: '💡',
};

export function getCategoryIcon(id) {
  return categoryIcons[id] || '✦';
}

export const categories = [
  {
    id: 'outdoor',
    name: 'Exterior',
    icon: '🌿',
    description: 'Eleva tus espacios exteriores con nuestra colección al aire libre',
    metaTitle: 'Exterior | Muebles y Conjuntos para Exterior | MURA Homes España!',
    metaDescription: 'Compra muebles de exterior MURA Homes: barbacoas, sofás, mesas, sillas y conjuntos de comedor para jardín y terraza. Renueva tu espacio al aire libre. Pide online ahora!',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=1000&fit=crop',
  },
  {
    id: 'sofas',
    name: 'Sofás',
    icon: '🛋️',
    description: 'El lujo y la comodidad se unen al diseño contemporáneo',
    metaTitle: 'Sofás de Diseño y Lujo para tu Hogar | MuraHomes España!',
    metaDescription: 'Encuentra sofás modernos, elegantes y de lujo en Mura Homes. Descubre diseños de cuero, modulares y sofás cama que combinan confort y estilo. ¡Compra el tuyo hoy!',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=1000&fit=crop',
  },
  {
    id: 'armchair',
    name: 'Sillones',
    icon: '💺',
    description: 'Piezas únicas que definen tu espacio de vida',
    metaTitle: 'Sillones de Diseño y Confort para tu Hogar | MURA Homes España!',
    metaDescription: 'Descubre sillones de diseño que transforman tu salón con estilo, confort y personalidad. Encuentra piezas únicas en MURA Homes y elige tu favorita. ¡Compra ahora!',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=1000&fit=crop',
  },
  {
    id: 'tables',
    name: 'Mesas',
    icon: '🪑',
    description: 'De comedor a centro de sala, elaboradas con precisión',
    metaTitle: 'Mesas de Comedor y Centro Modernas | MuraHomes España!',
    metaDescription: 'Descubre mesas de comedor y centro modernas, de mármol, madera y más en Mura Homes. Diseños elegantes para transformar tu hogar con estilo. ¡Compra ahora online ya!',
    image: 'https://res.cloudinary.com/djmavvggl/image/upload/f_auto,q_auto,w_1200/v1776519102/murahomes/products/gallery/auouvx3rkp78cdm3hqbj.png',
  },
  {
    id: 'chairs',
    name: 'Sillas',
    icon: '🪜',
    description: 'Elegancia ergonómica para cada estancia',
    metaTitle: 'Sillas de Diseño para Comedor | Elegancia y Confort | MuraHomes',
    metaDescription: 'Descubre sillas de diseño para comedor, oficina y salón en Mura Homes. Elige modelos elegantes y ergonómicos para cada espacio. Compra online y renueva tu hogar hoy.',
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&h=1000&fit=crop',
  },
  {
    id: 'bedroom',
    name: 'Dormitorio',
    icon: '🛏️',
    description: 'Transforma tu santuario con mobiliario de dormitorio refinado',
    metaTitle: 'Dormitorio | Camas y Muebles de Dormitorio Elegantes | MuraHomes',
    metaDescription: 'Descubre camas y muebles de dormitorio elegantes para crear un espacio acogedor y sofisticado. Compra en Mura Homes y transforma tu santuario con estilo, calidad y diseño elegante.',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=1000&fit=crop',
  },
  {
    id: 'cabinets',
    name: 'Armarios',
    icon: '🗄️',
    description: 'Soluciones de almacenamiento que son obras de arte',
    metaTitle: 'Comprar Armarios de Diseño | Elegancia y Almacenamiento | MuraHomes',
    metaDescription: 'Explora armarios modernos y elegantes para optimizar tu espacio con estilo. Descubre diseños funcionales y sofisticados en Mura Homes. ¡Compra tu armario ideal hoy!',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=1000&fit=crop',
  },
  {
    id: 'lighting',
    name: 'Iluminación',
    icon: '💡',
    description: 'Ilumina tu mundo con luminarias de diseñador',
    metaTitle: 'Iluminación de Diseño | Lámparas y Luminarias Elegantes Mura Homes',
    metaDescription: 'Encuentra lámparas y luminarias de diseño para cada espacio de tu hogar. Descubre modelos modernos de mesa, techo, pie y candelabros. Compra hoy y transforma tu espacio.',
    image: 'https://images.unsplash.com/photo-1718221621618-e477ce33485a?q=80&w=2089&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];
