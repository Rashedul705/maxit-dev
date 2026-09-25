import dbConnect from "@/lib/mongodb";
import LegalPage from "@/models/LegalPage";

export const dynamic = 'force-dynamic';

async function getTermsOfService() {
  try {
    await dbConnect();
    const doc = await LegalPage.findOne().lean();
    return doc?.termsOfService || "Terms of Service content goes here...";
  } catch (error) {
    console.error(error);
    return "Terms of Service content goes here...";
  }
}

export default async function Terms() {
  const content = await getTermsOfService();
  const paragraphs = content.split('\n').filter(p => p.trim() !== '');

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full max-w-[100vw]">
      <main className="flex-1 animate-slide-up overflow-hidden w-full">
        {/* Header */}
        <section className="relative pt-32 pb-20 bg-gradient-to-b from-primary/5 to-white overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/2 translate-y-1/2" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-5xl md:text-6xl font-bold font-heading text-primary mb-6 tracking-tight">
              Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-400">Service</span>
            </h1>
          </div>
        </section>

        <section className="pb-32 bg-white relative z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg prose-primary max-w-none">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-gray-700 font-medium leading-relaxed mb-6">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
