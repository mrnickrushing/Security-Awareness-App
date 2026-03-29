import Layout from "../components/Layout";

export default function Welcome() {
  return (
    <Layout title="Welcome to Computer Fundamentals & Security">
      <div className="space-y-6">

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-xl font-bold text-white">
            Welcome to the Training Platform
          </h2>
          <p className="mt-3 text-slate-300">
            This platform covers everything from computer troubleshooting and
            network fundamentals to phishing detection, device security, and
            privacy protection. Train at your own pace, earn section certificates,
            and prove your knowledge with real simulations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <h3 className="text-white font-semibold">Step 1</h3>
            <p className="mt-2 text-slate-400">
              Browse the seven training sections and start with the modules that matter most to you.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <h3 className="text-white font-semibold">Step 2</h3>
            <p className="mt-2 text-slate-400">
              Complete each module quiz with 80% or higher to unlock the next one and earn your section certificate.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <h3 className="text-white font-semibold">Step 3</h3>
            <p className="mt-2 text-slate-400">
              Test your skills in live phishing simulations and climb the leaderboard to earn your master certificate.
            </p>
          </div>

        </div>

      </div>
    </Layout>
  );
}
