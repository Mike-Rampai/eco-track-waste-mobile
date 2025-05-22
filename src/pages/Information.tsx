
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecycleIcon, InfoIcon, AlertTriangle } from 'lucide-react';
import DumpingReportForm from '@/components/DumpingReportForm';

const Information = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center flutter-text-gradient">E-Waste Information & Resources</h1>
      
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="info" className="flutter-tab">
            <InfoIcon className="h-4 w-4 mr-2" />
            General Info
          </TabsTrigger>
          <TabsTrigger value="benefits" className="flutter-tab">
            <RecycleIcon className="h-4 w-4 mr-2" />
            Benefits
          </TabsTrigger>
          <TabsTrigger value="report" className="flutter-tab">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Report Dumping
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card rounded-lg shadow-lg p-6 border flutter-card">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <InfoIcon className="h-5 w-5 mr-2 text-primary" />
                What is E-Waste?
              </h2>
              <p className="mb-4">Electronic waste, or e-waste, refers to electronic products that have reached the end of their "useful life" or are unwanted, non-working, or obsolete.</p>
              <p className="mb-4">Common e-waste items include:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Computers, laptops, and tablets</li>
                <li>Smartphones and cell phones</li>
                <li>Televisions and monitors</li>
                <li>Printers and copiers</li>
                <li>Audio equipment</li>
                <li>Batteries and lighting equipment</li>
                <li>Large appliances like refrigerators</li>
              </ul>
              <p>These items often contain hazardous materials such as lead, mercury, cadmium, and brominated flame retardants that can harm the environment if not disposed of properly.</p>
            </div>
            
            <div className="bg-card rounded-lg shadow-lg p-6 border flutter-card">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <InfoIcon className="h-5 w-5 mr-2 text-primary" />
                E-Waste Facts
              </h2>
              <ul className="space-y-4">
                <li className="flex">
                  <span className="text-primary font-bold mr-2">•</span>
                  <span>Global e-waste production is estimated at 50 million tons per year, with only 20% being formally recycled.</span>
                </li>
                <li className="flex">
                  <span className="text-primary font-bold mr-2">•</span>
                  <span>A single computer can contain up to 700 different materials, including gold, silver, and rare earth elements.</span>
                </li>
                <li className="flex">
                  <span className="text-primary font-bold mr-2">•</span>
                  <span>Recycling one million smartphones can recover about 35,000 pounds of copper, 772 pounds of silver, and 75 pounds of gold.</span>
                </li>
                <li className="flex">
                  <span className="text-primary font-bold mr-2">•</span>
                  <span>The value of recoverable materials in global e-waste is estimated at $62.5 billion annually.</span>
                </li>
                <li className="flex">
                  <span className="text-primary font-bold mr-2">•</span>
                  <span>E-waste represents only 2% of solid waste streams but accounts for 70% of the hazardous waste in landfills.</span>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="benefits" className="fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg shadow-lg p-6 border flutter-card">
              <h3 className="text-xl font-bold mb-3 text-primary">Environmental Benefits</h3>
              <ul className="space-y-3">
                <li className="flex">
                  <RecycleIcon className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                  <span>Reduces landfill waste and prevents toxic materials from contaminating soil and water</span>
                </li>
                <li className="flex">
                  <RecycleIcon className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                  <span>Conserves natural resources by recovering valuable materials</span>
                </li>
                <li className="flex">
                  <RecycleIcon className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                  <span>Reduces greenhouse gas emissions associated with manufacturing new products</span>
                </li>
                <li className="flex">
                  <RecycleIcon className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                  <span>Helps preserve biodiversity and ecosystems</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-card rounded-lg shadow-lg p-6 border flutter-card">
              <h3 className="text-xl font-bold mb-3 text-primary">Economic Benefits</h3>
              <ul className="space-y-3">
                <li className="flex">
                  <RecycleIcon className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                  <span>Creates green jobs in collection, processing, and recycling</span>
                </li>
                <li className="flex">
                  <RecycleIcon className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                  <span>Reduces costs associated with raw material extraction</span>
                </li>
                <li className="flex">
                  <RecycleIcon className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                  <span>Stimulates innovation in recycling technologies</span>
                </li>
                <li className="flex">
                  <RecycleIcon className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                  <span>Recovers valuable metals like gold, silver, and copper</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-card rounded-lg shadow-lg p-6 border flutter-card">
              <h3 className="text-xl font-bold mb-3 text-primary">Social Benefits</h3>
              <ul className="space-y-3">
                <li className="flex">
                  <RecycleIcon className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                  <span>Improves public health by reducing toxic exposure</span>
                </li>
                <li className="flex">
                  <RecycleIcon className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                  <span>Provides affordable refurbished electronics for communities</span>
                </li>
                <li className="flex">
                  <RecycleIcon className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                  <span>Raises awareness about responsible consumption</span>
                </li>
                <li className="flex">
                  <RecycleIcon className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                  <span>Supports digital inclusion through equipment donation programs</span>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="report" className="fade-in">
          <DumpingReportForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Information;
