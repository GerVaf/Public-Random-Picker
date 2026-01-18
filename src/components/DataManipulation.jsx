import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePickerStore } from "../store/usePickerStore";
import Logo from "../../public/justlwint.png";

/* ---------------------------------------
   Motion Variants
--------------------------------------- */

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemAnim = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

/* ---------------------------------------
   Component
--------------------------------------- */

const DataManipulation = () => {
  const [input, setInput] = useState("");

  const {
    items,
    selectedIds,
    addMany,
    toggleSelect,
    deleteSelected,
    deleteAll,
  } = usePickerStore();

  const handleAdd = () => {
    if (!input.trim()) return;
    addMany(input.split(/[\n,]/));
    setInput("");
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="
        h-full rounded-2xl
        bg-[#0b0b0b]
        p-6
        text-white
        shadow-2xl
        flex flex-col
      "
    >
      {/* ---------------------------------------
          Header
      --------------------------------------- */}
      <div className="mb-6 flex items-center gap-4">
        <div className="h-[50px] flex items-center">
          <img
            src={Logo}
            alt="Brand Logo"
            className="h-auto w-[200px] object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-widest text-red-700">
            Present by
          </span>
          <span className="text-xs tracking-widest text-neutral-400">
            JUST LWINT
          </span>
        </div>
      </div>

      {/* ---------------------------------------
          Input
      --------------------------------------- */}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste or type usernames…"
        rows={4}
        className="
          w-full resize-none rounded-xl
          border border-red-900/40
          bg-black p-4
          text-sm text-white
          placeholder:text-neutral-500
          focus:border-red-700 focus:outline-none
        "
      />

      {/* ---------------------------------------
          Actions
      --------------------------------------- */}
      <div className="mt-4 flex flex-wrap gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="
            rounded-xl bg-red-700
            px-5 py-2
            text-sm font-semibold tracking-wide
            hover:bg-red-600
          "
        >
          Add Data
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={deleteSelected}
          disabled={!selectedIds.size}
          className="
            rounded-xl border border-red-800
            px-5 py-2
            text-sm font-medium
            text-red-500
            disabled:opacity-30
          "
        >
          Delete Selected
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={deleteAll}
          disabled={!items.length}
          className="
            rounded-xl border border-neutral-800
            px-5 py-2
            text-sm font-medium
            text-neutral-400
            disabled:opacity-30
          "
        >
          Clear All
        </motion.button>
      </div>

      {/* ---------------------------------------
          Username List (More Space + Custom Scroll)
      --------------------------------------- */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="
          mt-6
          max-h-[420px]
          md:max-h-[520px]
          space-y-3
          overflow-y-auto
          pr-2
          scrollbar-street
        "
      >
        <AnimatePresence>
          {items.map((item) => {
            const isSelected = selectedIds.has(item.id);

            return (
              <motion.label
                key={item.id}
                variants={itemAnim}
                initial="hidden"
                animate="show"
                exit="exit"
                className={`
                  flex items-center gap-4
                  rounded-xl border
                  p-4
                  transition
                  ${
                    isSelected
                      ? "border-red-700 bg-red-900/20"
                      : "border-neutral-800 hover:border-neutral-600"
                  }
                `}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelect(item.id)}
                  className="accent-red-700 scale-100"
                />

                <span
                  className={`
                    block w-full rounded-md
                    px-3 py-2
                    text-lg font-bold uppercase tracking-wider
                    ${
                      isSelected
                        ? "bg-red-700/20 text-red-400"
                        : "bg-neutral-900 text-white"
                    }
                  `}
                >
                  {item.value}
                </span>
              </motion.label>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
};

export default DataManipulation;
