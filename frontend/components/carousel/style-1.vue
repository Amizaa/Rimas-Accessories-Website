<script setup>
import { ref, onMounted } from 'vue'
import Logo from '@/public/images/Logo.png'

const items = [
  { title: 'گوشواره', description: 'زیباترین گوشواره ها', href: '#', image: Logo},
  { title: 'گردنبند', description: 'با گردنبد های ما شیک شوید', href: '#', image: Logo },
  { title: 'دستبند', description: 'مناسب دست های ظریف شما', href: '#', image: Logo},
  { title: 'پابند', description: 'اصیل و زیبا بمانید', href: '#', image: Logo},
  { title: 'ست', description: 'برای پارتنر های عاشق', href: '#', image: Logo},

]

</script>

<template>
  <div class="w-full mt-5 flex items-center">
    <UCarousel
      v-slot="{ item, index }"
      orientation="vertical"
      :items="items"
      :ui="{ container: 'h-150 w-full', item: 'w-full', controls: 'absolute right-8  inset-y-70',
      dots: '-right-7',}"
      class="w-full mx-auto"
      dots
      autoplay
    >
    <section class=" relative w-full h-150 flex flex-col md:flex-row">
      <div :class="`w-full h-1/2 md:h-full relative overflow-hidden group shine-effect ${index % 2 === 0 ? '' : 'md:order-last'}`">
        <img :src="item.image" class="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1" />
        <div :class="`absolute inset-0 bg-gradient-to-${index % 2 === 0 ? 'r' : 'l'} from-neutral-950/70 to-neutral-950/50 transition-opacity duration-500 group-hover:opacity-0`"></div>
      </div>
      <div class="w-full h-1/2 md:h-full flex items-center justify-center p-8" :class="index === 1 ? 'bg-neutral-900' : 'bg-neutral-950'">
        <div class="max-w-lg float-animation text-center">
          <h2 class=" text-center text-4xl md:text-7xl font-bold leading-none bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent py-3">{{ item.title }}</h2>
          <p class="md:mt-6 text-neutral-400 text-lg leading-relaxed">{{ item.description }}</p>
          <button class=" cursor-pointer mt-2 md:mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-all duration-300 hover:tracking-wider">مشاهده {{item.title}} ها</button>
        </div>
      </div>
    </section>
  </UCarousel>

  </div>
</template>


<style scope>
    @keyframes reveal {
        from {
            clip-path: inset(0 100% 0 0);
        }
        to {
            clip-path: inset(0 0 0 0);
        }
    }

    @keyframes textReveal {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes float {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }

    @keyframes shine {
        from {
            transform: translateX(-100%) rotate(45deg);
        }
        to {
            transform: translateX(200%) rotate(45deg);
        }
    }

    .shine-effect::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
        );
        transform: translateX(-100%) rotate(45deg);
    }

    .shine-effect:hover::before {
        animation: shine 1.5s;
    }

    .float-animation {
        animation: float 6s ease-in-out infinite;
    }

    .split-reveal {
        animation: reveal 1.2s cubic-bezier(0.77, 0, 0.175, 1);
    }

    .text-reveal {
        animation: textReveal 0.8s cubic-bezier(0.77, 0, 0.175, 1);
    }

    .scroll-container {
       pointer-events: auto;
        scroll-snap-type: y mandatory;
        -webkit-overflow-scrolling: touch;
    }

    .scroll-section {
        scroll-snap-align: start;
        scroll-snap-stop: always;
    }

    .content-mask {
        -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
        mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
    }
</style>