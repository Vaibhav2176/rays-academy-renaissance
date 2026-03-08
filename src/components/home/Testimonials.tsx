import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    name: 'Avnish Joshi',
    text: 'Rays Academy ne meri life change kar di! Yahan ke teachers itna personally dhyan dete hain ki har concept crystal clear ho jata hai. Maths jo mujhe sabse mushkil lagti thi, ab favourite subject ban gayi hai.',
  },
  {
    name: 'Ridam Jain',
    text: 'Best coaching in Bhopal, no doubt! Study material itna accha hai ki alag se kuch padhne ki zaroorat hi nahi padti. Regular tests aur doubt sessions se confidence bahut badha.',
  },
  {
    name: 'Palak Yadav',
    text: 'Maine yahan join kiya aur meri rank dramatically improve hui. Shankar sir ka maths padhane ka tarika alag hai – ek baar samajh aa jaye toh kabhi bhoolte nahi. Thank you Rays Academy! 🙏',
  },
  {
    name: 'Manas Nathani',
    text: 'Yahan ka environment bahut positive hai. Teachers sirf syllabus nahi padhate, balki exam strategy bhi sikhate hain. Mera board result 95%+ aaya, sab Rays Academy ki wajah se!',
  },
  {
    name: 'Bhavya Kriplani',
    text: 'Trial classes liye the 5 din ke, first day se hi laga ki yahi sahi jagah hai. Faculty experienced hai, AC classrooms hain, aur sabse important baat – yahan pe har student matter karta hai.',
  },
  {
    name: 'Chestha Tolani',
    text: 'Mere parents bhi bahut khush hain results dekh ke. Rays Academy mein discipline aur padhai dono saath saath chalti hai. Library facility bhi bahut helpful hai exam time pe.',
  },
  {
    name: 'Mrityunjay Menaria',
    text: 'Rays Academy mein padhne ka experience bahut alag hai. Yahan teachers har student ka individually dhyan rakhte hain aur weak areas pe focus karte hain. Mera confidence bahut badha yahan aake! 🔥',
  },
  {
    name: 'Ankit Singh',
    text: 'Maths mein 100/100 aaye boards mein! Shankar sir ke guidance aur practice sheets ki wajah se yeh possible hua. Rays Academy ka maths teaching level ekdum top-notch hai. 💯',
  },
  {
    name: 'Samyak Jain',
    text: 'Board mein Maths mein full 100 marks! Yahan ki teaching method itni strong hai ki concepts bilkul clear ho jate hain. Rays Academy join karna meri best decision thi! 🏆',
  },
  {
    name: 'Tushar Golani',
    text: 'Rays Academy ka padhai ka tarika bahut systematic hai. Notes, tests, doubt sessions – sab perfectly planned hota hai. Yahan aake padhai mein bahut improvement aayi.',
  },
  {
    name: 'Tejasi Gour',
    text: 'Bahut accha experience raha Rays Academy mein. Teachers bahut supportive hain aur hamesha motivate karte rehte hain. Mera result har saal improve hota gaya! 🌟',
  },
  {
    name: 'Natik Verma',
    text: 'Rays Academy mein jo discipline aur focus milta hai woh kahin aur nahi milta. Regular tests se exam ka darr khatam ho gaya aur self-confidence build hua. Best coaching! 👍',
  },
  {
    name: 'Mohal Vardhan Jain',
    text: 'Yahan ke faculty members bahut dedicated hain. Har doubt clear hota hai chahe kitni baar bhi poocho. Rays Academy ne meri academic journey ko bilkul transform kar diya! ✨',
  },
  {
    name: 'Priyanshi Dave',
    text: 'Rays Academy mein padh ke mujhe realize hua ki sahi guidance kitni important hoti hai. Yahan ke teachers ne meri weaknesses identify karke unpe kaam kiya. Result mein fark saaf dikha! 🙌',
  },
  {
    name: 'Lakshya Kewlani',
    text: 'Mera naam Lakshya hai aur Rays Academy ne sach mein mujhe apne lakshya tak pahunchne mein help kiya. Yahan ki teaching quality aur environment dono hi outstanding hain. Proud to be a Rays student! 🎯',
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const Testimonials = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-secondary/30 to-background relative overflow-hidden">
      <div className="absolute -right-40 top-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute -left-40 bottom-20 w-80 h-80 bg-rays-blue-400/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="section-title">
            💬 What Our Students Say
          </motion.h2>
          <motion.p variants={fadeInUp} className="section-subtitle mt-4">
            Suniye humare students ke apne words mein
          </motion.p>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <Card className="h-full group hover:shadow-2xl transition-all duration-500 border-0 bg-card shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-accent/40 mb-4" />
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{t.name}</p>
                      <div className="flex gap-0.5 mt-0.5">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="w-3 h-3 fill-accent text-accent" />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
