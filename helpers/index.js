function labTest ({ cost, fee, apr, daysOfUnstake, days }) {
  const dailyAPR = apr / (365 * 100)
  let myMoney = cost
  let totalOfUnstake = 0
  const experimental = []

  for (let day = 1; day <= days; day++) {
    totalOfUnstake += (myMoney * dailyAPR)
    let currentFee = fee * -1

    if (day % daysOfUnstake === 0 || day === days) {
      myMoney += totalOfUnstake - fee
      totalOfUnstake = 0
    } else {
      currentFee = 0
    }

    experimental.push({ day, compounding: myMoney, pendingReward: totalOfUnstake, fee: currentFee })
  }

  return { money: myMoney, experimental }
}

function findTheBestForUnstake ({ cost, fee, apr, days }) {
  const experimentalResults = []

  for (let day = 1; day <= days; day++) {
    const { money, experimental } = labTest({ cost, fee, apr, daysOfUnstake: day, days })

    experimentalResults.push({ days: day, money, experimental })
  }

  const theBestResult = experimentalResults.reduce(function (store, data) {
    if (data.money > store.money) {
      return data
    }

    return store
  }, { days: 0, money: 0 })

  return { experimentalResults, theBestResult }
}

export {
  labTest,
  findTheBestForUnstake
}
