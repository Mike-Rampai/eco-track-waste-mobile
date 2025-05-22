
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RecycleIcon, 
  BarChart3Icon, 
  AlertTriangleIcon, 
  TreesIcon, 
  LightbulbIcon,
  ArrowRightIcon,
  HelpCircleIcon,
  CheckCircle2Icon,
  Smartphone,
  Battery,
  Cpu,
  Monitor
} from 'lucide-react';

// Component for FAQ Item
const FAQItem = ({ question, answer }: { question: string; answer: string }) => (
  <div className="border-b border-border pb-4 mb-4 last:border-0">
    <h3 className="text-lg font-medium mb-2 flex items-start">
      <HelpCircleIcon className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
      <span>{question}</span>
    </h3>
    <p className="text-muted-foreground ml-7">{answer}</p>
  </div>
);

// Component for Material Card
const MaterialCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <Card className="flutter-card hover:shadow-md transition-all">
    <CardHeader className="pb-2">
      <div className="flex items-center">
        <div className="p-2 bg-primary/10 rounded-full text-primary mr-3">
          {icon}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const Information = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl fade-in">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Learn About <span className="flutter-text-gradient">E-Waste</span> Recycling
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Understand why proper electronic waste disposal matters and how it impacts our environment.
        </p>
      </div>

      <Tabs defaultValue="why" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
          <TabsTrigger value="why">Why Recycle</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="process">Our Process</TabsTrigger>
          <TabsTrigger value="faq">FAQs</TabsTrigger>
        </TabsList>
        
        {/* Why Recycle Tab */}
        <TabsContent value="why" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="flutter-card h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangleIcon className="h-5 w-5 text-primary mr-2" />
                  Environmental Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  E-waste contains toxic materials like lead, mercury, and cadmium that can leach into soil and water when improperly disposed of, causing significant environmental damage.
                </p>
                <p>
                  Landfilled electronics release harmful chemicals that can contaminate groundwater and affect wildlife habitats in surrounding areas.
                </p>
                <div className="mt-4 bg-eco-green-light/10 p-4 rounded-lg text-sm">
                  <p className="font-medium mb-2">Did You Know?</p>
                  <p>Just one computer monitor can contain up to 8 pounds of lead, which is highly toxic to humans and animals.</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="flutter-card h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <RecycleIcon className="h-5 w-5 text-primary mr-2" />
                  Resource Conservation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Electronic devices contain valuable materials like gold, silver, copper, and rare earth elements that can be recovered and reused.
                </p>
                <p>
                  Recycling one million cell phones can recover approximately 35,000 pounds of copper, 772 pounds of silver, 75 pounds of gold, and 33 pounds of palladium.
                </p>
                <div className="mt-4 bg-eco-blue-light/10 p-4 rounded-lg text-sm">
                  <p className="font-medium mb-2">Resource Recovery</p>
                  <p>Recycling electronics conserves natural resources and reduces the energy needed for mining and manufacturing new products.</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="flutter-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3Icon className="h-5 w-5 text-primary mr-2" />
                E-Waste Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-3xl font-bold text-primary">57.4M</p>
                  <p className="text-sm text-muted-foreground mt-2">Tons of e-waste generated globally in 2021</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-3xl font-bold text-primary">17.4%</p>
                  <p className="text-sm text-muted-foreground mt-2">Global e-waste documented to be properly collected and recycled</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-3xl font-bold text-primary">$57B</p>
                  <p className="text-sm text-muted-foreground mt-2">Value of raw materials in global e-waste (2019)</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-3xl font-bold text-primary">74.7M</p>
                  <p className="text-sm text-muted-foreground mt-2">Projected tons of e-waste by 2030</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-gradient-to-r from-eco-green-dark to-eco-blue-dark rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h3>
            <p className="mb-6 max-w-lg mx-auto">
              Start recycling your electronic waste today and contribute to a more sustainable future.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register">
                <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-100 flutter-button">
                  Register Your E-Waste
                </Button>
              </Link>
              <Link to="/request">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 flutter-button">
                  Schedule Collection
                </Button>
              </Link>
            </div>
          </div>
        </TabsContent>
        
        {/* Materials Tab */}
        <TabsContent value="materials" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <MaterialCard 
              icon={<Smartphone className="h-5 w-5" />}
              title="Mobile Phones"
              description="Contains gold, silver, copper, platinum, palladium, and other precious metals that can be recovered and reused."
            />
            <MaterialCard 
              icon={<Battery className="h-5 w-5" />}
              title="Batteries"
              description="Contain lithium, cobalt, and nickel that can be extracted and reused in new batteries and other products."
            />
            <MaterialCard 
              icon={<Cpu className="h-5 w-5" />}
              title="Circuit Boards"
              description="Rich in gold, silver, copper, and palladium. One metric ton of circuit boards can contain 40-800 times more gold than one metric ton of ore."
            />
            <MaterialCard 
              icon={<Monitor className="h-5 w-5" />}
              title="Monitors & TVs"
              description="Contain lead, mercury (older models), glass, and plastic that can be processed and recycled separately."
            />
            <MaterialCard 
              icon={<RecycleIcon className="h-5 w-5" />}
              title="Plastics"
              description="Various types of plastics that can be recycled into new products, reducing petroleum consumption and plastic waste."
            />
            <MaterialCard 
              icon={<TreesIcon className="h-5 w-5" />}
              title="Rare Earth Elements"
              description="Critical for many modern technologies. Recycling these materials reduces the environmental impact of mining."
            />
          </div>
          
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Materials Recovery Process</h3>
            <div className="bg-muted/30 p-6 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <p className="text-sm font-medium">Collection</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <p className="text-sm font-medium">Sorting</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <p className="text-sm font-medium">Dismantling</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold">4</span>
                  </div>
                  <p className="text-sm font-medium">Processing</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold">5</span>
                  </div>
                  <p className="text-sm font-medium">Recovery</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Process Tab */}
        <TabsContent value="process" className="space-y-6">
          <Card className="flutter-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <RecycleIcon className="h-5 w-5 text-primary mr-2" />
                Our Recycling Process
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-l-4 border-primary pl-4 py-2 mb-6">
                <h3 className="text-lg font-medium mb-1">1. Collection</h3>
                <p className="text-muted-foreground">
                  We collect e-waste items from your location at a time that's convenient for you. Our trained staff ensures safe handling of all electronic devices.
                </p>
              </div>
              
              <div className="border-l-4 border-primary pl-4 py-2 mb-6">
                <h3 className="text-lg font-medium mb-1">2. Data Destruction</h3>
                <p className="text-muted-foreground">
                  All data-containing devices undergo secure data wiping and destruction processes to protect your privacy and confidential information.
                </p>
              </div>
              
              <div className="border-l-4 border-primary pl-4 py-2 mb-6">
                <h3 className="text-lg font-medium mb-1">3. Sorting & Dismantling</h3>
                <p className="text-muted-foreground">
                  Items are sorted by type and carefully dismantled to separate components like circuit boards, metals, plastics, and glass.
                </p>
              </div>
              
              <div className="border-l-4 border-primary pl-4 py-2 mb-6">
                <h3 className="text-lg font-medium mb-1">4. Resource Recovery</h3>
                <p className="text-muted-foreground">
                  Using advanced techniques, we recover valuable materials including precious metals, rare earth elements, and recyclable plastics.
                </p>
              </div>
              
              <div className="border-l-4 border-primary pl-4 py-2">
                <h3 className="text-lg font-medium mb-1">5. Responsible Disposal</h3>
                <p className="text-muted-foreground">
                  Any materials that cannot be recycled are disposed of responsibly following environmental regulations to prevent harm to ecosystems.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <Card className="flutter-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle2Icon className="h-5 w-5 text-primary mr-2" />
                  Our Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <CheckCircle2Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-medium">R2 (Responsible Recycling)</span>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Ensures proper handling of electronic waste and focuses on data security.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <CheckCircle2Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-medium">e-Stewards</span>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Prohibits export of hazardous e-waste to developing countries and ensures worker safety.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <CheckCircle2Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-medium">ISO 14001</span>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Environmental Management System certification.
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="flutter-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LightbulbIcon className="h-5 w-5 text-primary mr-2" />
                  Environmental Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <ArrowRightIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-medium">Reduced Landfill Waste</span>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Keeps electronic waste out of landfills where toxic materials can leach into soil and water.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <ArrowRightIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-medium">Energy Conservation</span>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Recycling materials requires less energy than mining and processing virgin resources.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <ArrowRightIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-medium">Carbon Footprint Reduction</span>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Lower emissions from reduced mining, manufacturing, and transportation activities.
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* FAQs Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card className="flutter-card">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FAQItem 
                question="What items can I recycle through your service?"
                answer="We accept most electronic devices including computers, laptops, mobile phones, tablets, printers, monitors, TVs, small appliances, batteries, and accessories like keyboards, mice, and cables."
              />
              <FAQItem 
                question="Is there a fee for e-waste collection?"
                answer="Basic collection for most items is free. There may be a small fee for certain items like CRT monitors or large appliances due to their specialized handling requirements."
              />
              <FAQItem 
                question="How is my data protected when I recycle devices?"
                answer="We follow industry-standard data destruction processes including secure data wiping, physical destruction of storage media, and provide certificates of data destruction upon request."
              />
              <FAQItem 
                question="Can I track the status of my collection request?"
                answer="Yes, once you schedule a collection, you'll receive confirmation with tracking information so you can monitor the status of your pickup."
              />
              <FAQItem 
                question="What happens to my device after it's collected?"
                answer="Devices are transported to our certified recycling facility where they're sorted, dismantled, and processed to recover valuable materials. Components are then sent to specialized facilities for further processing."
              />
              <FAQItem 
                question="Do you provide certificates for recycled items?"
                answer="Yes, we can provide certificates of recycling for businesses and organizations that require documentation for compliance purposes."
              />
              <FAQItem 
                question="Can I drop off my e-waste instead of scheduling a pickup?"
                answer="Yes, we have drop-off locations in most major cities. Check our app for the nearest drop-off point and their operating hours."
              />
            </CardContent>
          </Card>
          
          <div className="text-center p-8 bg-muted/30 rounded-xl">
            <h3 className="text-xl font-medium mb-4">Still Have Questions?</h3>
            <p className="text-muted-foreground mb-6">Our customer support team is ready to assist you with any inquiries.</p>
            <Button className="flutter-button">
              Contact Support
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Information;
