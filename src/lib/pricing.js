// The core business model difference: owners keep 100% of their listed
// price. WheelHouse's only revenue is a processing fee paid by the renter
// on top of the owner's price — never a cut of what the owner earns.
export const PROCESSING_FEE_RATE = 0.08 // 8%, adjust freely — it never touches owner payout

export function priceBreakdown(pricePerDay) {
  const fee = Math.round(pricePerDay * PROCESSING_FEE_RATE * 100) / 100
  const renterPaysPerDay = Math.round((pricePerDay + fee) * 100) / 100
  return {
    ownerReceivesPerDay: pricePerDay,
    feePerDay: fee,
    renterPaysPerDay,
  }
}
