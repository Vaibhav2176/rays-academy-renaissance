import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Medal, Star, TrendingUp, ArrowRight, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Results = () => {
  const toppers = [
    { name: 'Aditya Sharma', exam: 'JEE Advanced 2024', rank: 'AIR 156', score: '98.5%', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face' },
    { name: 'Priya Patel', exam: 'NEET 2024', rank: 'AIR 234', score: '99.2%', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face' },
    { name: 'Rahul Verma', exam: 'NDA 2024', rank: 'AIR 89', score: '97.8%', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face' },
    { name: 'Sneha Gupta', exam: 'CBSE 12th 2024', rank: 'City Topper', score: '99.4%', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face' },
  ];

  const yearlyResults = [
    { year: '2024', total: 250, above90: 180, above95: 95, toppers: 12 },
    { year: '2023', total: 230, above90: 165, above95: 82, toppers: 10 },
    { year: '2022', total: 210, above90: 150, above95: 70, toppers: 8 },
    { year: '2021', total: 195, above90: 140, above95: 65, toppers: 7 },
  ];

  const achievements = [
    { icon: Trophy, title: '100% Pass Rate', description: 'Consistent success rate since 2006', color: 'from-yellow-500 to-orange-500' },
    { icon: Medal, title: '500+ Selections', description: 'In IIT-JEE, NEET, and NDA combined', color: 'from-blue-500 to-cyan-500' },
    { icon: Star, title: '50+ City Toppers', description: 'In board examinations', color: 'from-purple-500 to-pink-500' },
    { icon: TrendingUp, title: '95% Above 80%', description: 'Students scoring distinction', color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-rays-blue-700 to-primary" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-rays-blue-400/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground mb-6">
              Our Results
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              A legacy of excellence and consistent success since 2006
            </p>
          </motion.div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {achievements.map((item, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full text-center p-6 hover:shadow-xl transition-all duration-300 group overflow-hidden relative border-0 shadow-lg">
                  <CardContent className="p-0">
                    <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Top Performers Section */}
      <section className="py-24 bg-gradient-to-b from-secondary/30 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="section-title">
              🏆 Our Star Performers
            </motion.h2>
            <motion.p variants={fadeInUp} className="section-subtitle mt-4">
              Meet our recent toppers who made us proud
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {toppers.map((topper, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full text-center overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg">
                  <div className="h-2 w-full bg-gradient-to-r from-accent to-rays-blue-600" />
                  <CardContent className="p-6">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <img
                        src={topper.image}
                        alt={topper.name}
                        className="w-full h-full rounded-full object-cover border-4 border-accent/20 group-hover:border-accent transition-colors duration-300"
                      />
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-accent-foreground" />
                      </div>
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                      {topper.name}
                    </h3>
                    <Badge variant="secondary" className="mb-2">
                      {topper.exam}
                    </Badge>
                    <div className="flex justify-center gap-4 mt-3">
                      <div>
                        <div className="text-2xl font-bold text-accent">{topper.rank}</div>
                        <div className="text-xs text-muted-foreground">Rank</div>
                      </div>
                      <div className="w-px bg-border" />
                      <div>
                        <div className="text-2xl font-bold text-primary">{topper.score}</div>
                        <div className="text-xs text-muted-foreground">Score</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Year-wise Results */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
              Year-wise Performance
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-primary-foreground/70 max-w-2xl mx-auto">
              Consistent growth and excellence across all years
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="overflow-x-auto"
          >
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-primary-foreground/20">
                  <th className="text-left py-4 px-6 text-primary-foreground font-semibold">Year</th>
                  <th className="text-center py-4 px-6 text-primary-foreground font-semibold">Total Students</th>
                  <th className="text-center py-4 px-6 text-primary-foreground font-semibold">Above 90%</th>
                  <th className="text-center py-4 px-6 text-primary-foreground font-semibold">Above 95%</th>
                  <th className="text-center py-4 px-6 text-primary-foreground font-semibold">District Toppers</th>
                </tr>
              </thead>
              <tbody>
                {yearlyResults.map((result, index) => (
                  <motion.tr
                    key={index}
                    variants={fadeInUp}
                    className="border-b border-primary-foreground/10 hover:bg-primary-foreground/5 transition-colors"
                  >
                    <td className="py-4 px-6 text-primary-foreground font-bold text-lg">{result.year}</td>
                    <td className="py-4 px-6 text-center text-primary-foreground/80">{result.total}</td>
                    <td className="py-4 px-6 text-center">
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                        {result.above90}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Badge className="bg-accent/20 text-accent border-accent/30">
                        {result.above95}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Award className="w-5 h-5 text-yellow-400" />
                        <span className="text-primary-foreground font-bold">{result.toppers}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
              Be the Next Topper!
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join Rays Academy and start your journey towards success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="btn-primary">
                  Enroll Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/courses">
                <Button size="lg" variant="outline">
                  Explore Courses
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Results;
