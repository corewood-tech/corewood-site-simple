
import { Users } from "lucide-react";

const Team = () => {
  return (
    <section id="team" className="py-24 bg-secondary/30">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 stagger-animate">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
            Our Team
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6">
            Meet the Experts Behind Corewood
          </h2>
          <p className="text-muted-foreground">
            Our leadership team brings decades of experience in technology, data analysis, and business operations to help solve your complex ML challenges.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-background/50 rounded-lg p-8 border border-border/50 hover:shadow-lg transition-shadow">
            <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-bold text-xl mb-3">Kyle Mickey, Co-Founder</h3>
            <p className="text-muted-foreground">
              Kyle Mickey brings over 10 years of expertise in systems architecture and cloud infrastructure to Corewood. With extensive experience designing secure, scalable solutions for enterprise clients, Kyle specializes in API governance, containerization (Kubernetes), and cloud platforms (AWS, GCP). His background implementing identity systems and process automation for distributed teams enables him to architect Corewood's revolutionary ML inference technology that optimizes performance while maintaining stringent security standards. Kyle's technical ingenuity is the driving force behind our ability to deliver ML solutions that are faster, more cost-efficient, and environmentally sustainable.
            </p>
          </div>
          
          <div className="bg-background/50 rounded-lg p-8 border border-border/50 hover:shadow-lg transition-shadow">
            <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-bold text-xl mb-3">Melissa Anthony, Co-Founder</h3>
            <p className="text-muted-foreground">
              Melissa Anthony combines 15+ years of data expertise with a unique academic background in Anthropology, Geography, and GIS to lead Corewood's data science initiatives. Her specialized knowledge in spatial analysis, machine learning, and human behavior patterns enables her to optimize model performance and validate real-world applications of our technology. Melissa has successfully built GIS applications identifying critical infrastructure upgrades and developed executive-facing analytics dashboards that transform complex data into actionable insights. Her practical approach to data science ensures Corewood's ML inference solutions deliver measurable, reliable results while maintaining a focus on sustainability and accessibility.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
