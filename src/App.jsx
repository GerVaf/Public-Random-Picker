import DataManipulation from "./components/DataManipulation";
import PrizePool from "./components/PrizePool";
import Wheel from "./components/Wheel";

const App = () => {
  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <div className="mx-auto max-w-[1600px] px-6 py-6">
        {/* Row Layout */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Prize Pool */}
          <section
            className="
              w-full
              lg:w-[30%]
              rounded-2xl
              bg-[#0b0b0b]
              p-4
              shadow-2xl
            "
          >
            <PrizePool />
          </section>

          {/* Wheel */}
          <section
            className="
              w-full
              lg:w-[40%]
              rounded-2xl
              bg-[#0b0b0b]
              p-4
              shadow-2xl
              flex items-center justify-center
            "
          >
            <Wheel />
          </section>

          {/* Data Manipulation */}
          <section
            className="
              w-full
              lg:w-[30%]
              rounded-2xl
              bg-[#0b0b0b]
              shadow-2xl
            "
          >
            <DataManipulation />
          </section>
        </div>
      </div>
    </main>
  );
};

export default App;
