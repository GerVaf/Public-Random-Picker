import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePickerStore } from "../store/usePickerStore";

const SIZE = 360;

const Wheel = () => {
  const { items, activePrizeId, prizes, assignPrizeOwner } = usePickerStore();

  const [winner, setWinner] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [currentLabel, setCurrentLabel] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalPrize, setModalPrize] = useState(null);
  const closeModal = () => {
    setShowModal(false);
    setModalPrize(null);
    setWinner(null);
  };

  const names = useMemo(() => items.map((i) => i.value), [items]);

  const activePrize = prizes.find((p) => p.id === activePrizeId);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const spin = async () => {
  if (!names.length || spinning || !activePrizeId) return;

  setSpinning(true);
  setWinner(null);

  const winnerIndex = Math.floor(Math.random() * names.length);
  const winnerName = names[winnerIndex];

  const duration = 2500; // TOTAL animation time
  const startTime = Date.now();

  let index = Math.floor(Math.random() * names.length);

  while (Date.now() - startTime < duration) {
    setCurrentLabel(names[index % names.length]);
    index++;

    const progress = (Date.now() - startTime) / duration;

    // ease-out delay
    const delay = 30 + 120 * Math.pow(progress, 2);

    await sleep(delay);
  }

  // LAND ON WINNER
  setCurrentLabel(winnerName);
  setWinner(winnerName);

  setModalPrize(activePrize);
  assignPrizeOwner(winnerName);

  setSpinning(false);
  setShowModal(true);
};

  return (
    <>
      {/* =========================
         MAIN WHEEL UI
      ========================= */}
      <div className="flex h-full flex-col items-center justify-center">
        {/* Pointer Marquee */}
        <motion.div
          className="mb-2 min-w-[240px] rounded-lg border border-red-800 bg-black px-4 py-2 text-center text-sm font-bold uppercase tracking-widest text-red-500"
          animate={spinning ? { opacity: [0.6, 1, 0.6] } : { opacity: 1 }}
          transition={{ duration: 1.1, repeat: spinning ? Infinity : 0 }}
        >
          {currentLabel || "READY"}
        </motion.div>

        {/* Pointer */}
        <div className="relative z-20 h-0 w-0 border-l-8 border-r-8 border-b-[14px] border-l-transparent border-r-transparent border-b-red-700" />

        {/* Static Wheel */}
        <div
          className="relative rounded-full bg-black border-[6px] border-red-800 shadow-2xl"
          style={{ width: SIZE, height: SIZE }}
        >
          <div className="absolute inset-0 m-auto h-24 w-24 rounded-full bg-[#0b0b0b] border border-neutral-800 flex items-center justify-center text-xs tracking-widest text-neutral-400">
            WHEEL
          </div>
        </div>

        {/* Spin Button */}
        <button
          onClick={spin}
          disabled={spinning || !names.length || !activePrizeId}
          className="mt-6 rounded-xl bg-red-700 px-8 py-3 text-sm font-bold tracking-widest text-white hover:bg-red-600 disabled:opacity-40"
        >
          {activePrizeId ? "SPIN" : "NO ACTIVE PRIZE"}
        </button>

        {/* Winner Label */}
        <div className="mt-5 text-center">
          <div className="text-xs tracking-widest text-neutral-400">WINNER</div>

          <motion.div
            className="mt-1 text-xl font-bold uppercase tracking-wider text-red-600"
            animate={
              winner
                ? {
                    scale: [0.9, 1.15, 1],
                    textShadow: [
                      "0 0 0 rgba(0,0,0,0)",
                      "0 0 14px rgba(239,68,68,0.85)",
                      "0 0 8px rgba(239,68,68,0.6)",
                    ],
                  }
                : spinning
                ? { opacity: [0.4, 1, 0.4] }
                : {}
            }
            transition={{
              duration: winner ? 0.7 : 1.1,
              repeat: spinning && !winner ? Infinity : 0,
            }}
          >
            {spinning ? "WAITING…" : winner || "—"}
          </motion.div>
        </div>
      </div>

      {/* =========================
         WINNER MODAL
      ========================= */}
      <AnimatePresence>
        {showModal && winner && modalPrize && (
          <motion.div
            className="
              fixed inset-0 z-50
              flex items-center justify-center
              bg-black/80 backdrop-blur
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            {/* Modal Card */}
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
              className="
                relative
                w-full max-w-md
                rounded-2xl
                bg-[#0b0b0b]
                p-8
                text-center
                shadow-2xl
                border border-red-800
              "
            >
              {/* Header */}
              <div className="mb-3 text-xs tracking-[0.25em] text-neutral-400">
                CONGRATULATIONS
              </div>

              {/* Winner Name */}
              <div
                className="
                  mb-4
                  text-3xl
                  font-extrabold
                  uppercase
                  tracking-wider
                  text-red-600
                "
              >
                {winner}
              </div>

              {/* Subtitle */}
              <div className="mb-4 text-sm text-neutral-400">
                You proudly won
              </div>

              {/* Prize Name */}
              <div
                className="
                  mb-6
                  text-lg
                  font-bold
                  uppercase
                  tracking-wide
                "
              >
                {modalPrize.name}
              </div>

              {/* Prize Image */}
              <div className="mb-6 flex justify-center">
                <img
                  src={modalPrize.image}
                  alt={modalPrize.name}
                  className="
                    h-40 w-40
                    rounded-xl
                    object-cover
                    border border-neutral-700
                    shadow-lg
                  "
                />
              </div>

              {/* Action */}
              <button
                onClick={closeModal}
                className="
                  w-full
                  rounded-lg
                  bg-red-700
                  py-3
                  text-sm
                  font-bold
                  tracking-widest
                  hover:bg-red-600
                  transition
                "
              >
                CLOSE
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Wheel;
