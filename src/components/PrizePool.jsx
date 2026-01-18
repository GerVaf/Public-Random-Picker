import { useState } from "react";
import { motion } from "framer-motion";
import { usePickerStore } from "../store/usePickerStore";

const PrizePool = () => {
  const {
    prizes,
    activePrizeId,
    addPrize,
    setActivePrize,
    deletePrize,
  } = usePickerStore();

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);

  /* --------------------------------
     FORM VALIDATION
  -------------------------------- */
  const isFormValid = Boolean(name.trim() && image);

  /* --------------------------------
     IMAGE HANDLER (BASE64)
  -------------------------------- */
  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  /* --------------------------------
     ADD PRIZE
  -------------------------------- */
  const handleAddPrize = () => {
    if (!isFormValid) return;

    addPrize({ name: name.trim(), image });
    setName("");
    setImage(null);
  };

  return (
    <section className="rounded-2xl bg-[#0b0b0b] p-4 shadow-2xl">
      {/* Header */}
      <div className="mb-4 text-xs tracking-widest text-neutral-400">
        PRIZE POOL
      </div>

      {/* ================================
         PRIZE INPUT
      ================================ */}
      <div className="mb-6 rounded-xl border border-neutral-800 p-4">
        <div className="grid grid-cols-1 gap-3">
          {/* Prize Name */}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Prize name"
            className="
              rounded-lg bg-black
              border border-neutral-700
              px-3 py-2 text-sm
              text-white
              placeholder:text-neutral-500
              focus:border-red-700
              focus:outline-none
            "
          />

          {/* Image Upload */}
          <div className="flex items-center gap-3">
            <label
              className="
                cursor-pointer rounded-lg
                border border-neutral-700
                px-4 py-2 text-sm
                hover:border-neutral-500
              "
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImage}
              />
            </label>

            {image && (
              <div className="h-14 w-14 overflow-hidden rounded-lg border border-neutral-700">
                <img
                  src={image}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Add Prize Button */}
          <motion.button
            whileTap={isFormValid ? { scale: 0.97 } : undefined}
            onClick={handleAddPrize}
            disabled={!isFormValid}
            className={`
              mt-2 w-full rounded-lg py-2
              text-sm font-bold transition
              ${
                isFormValid
                  ? "bg-red-700 hover:bg-red-600 cursor-pointer text-white"
                  : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
              }
            `}
          >
            Add Prize
          </motion.button>

          {/* Helper Text */}
          {!isFormValid && (
            <div className="text-xs text-neutral-500">
              Enter a prize name and upload an image
            </div>
          )}
        </div>
      </div>

      {/* ================================
         PRIZE GRID (2 PER ROW)
      ================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prizes.map((prize) => {
          const isActive = prize.id === activePrizeId;

          return (
            <div
              key={prize.id}
              className={`
                relative flex flex-col
                rounded-xl border p-3
                ${
                  prize.claimed
                    ? "border-neutral-800 bg-neutral-900"
                    : isActive
                    ? "border-red-700 bg-red-900/10"
                    : "border-neutral-700"
                }
              `}
            >
              {/* Image */}
              <div className="mb-3 h-28 overflow-hidden rounded-lg bg-black">
                <img
                  src={prize.image}
                  alt={prize.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Prize Name */}
              <div className="mb-2 text-sm font-bold uppercase tracking-wide">
                {prize.name}
              </div>

              {/* Owner */}
              {prize.claimed && (
                <div className="mb-2 text-xs text-red-500">
                  WON BY: {prize.owner}
                </div>
              )}

              {/* Actions */}
              <div className="mt-auto flex gap-2">
                {!prize.claimed && (
                  <button
                    onClick={() => setActivePrize(prize.id)}
                    className="
                      flex-1 rounded-md
                      border border-neutral-700
                      py-1 text-xs
                      hover:border-neutral-500
                    "
                  >
                    Set Active
                  </button>
                )}

                <button
                  onClick={() => deletePrize(prize.id)}
                  className="
                    rounded-md border border-neutral-700
                    px-2 text-xs text-neutral-400
                    hover:text-red-500
                  "
                >
                  Delete
                </button>
              </div>

              {/* Active Badge */}
              {isActive && !prize.claimed && (
                <span className="
                  absolute right-2 top-2
                  rounded-full bg-red-700
                  px-2 py-0.5
                  text-[10px] font-bold
                ">
                  ACTIVE
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PrizePool;
