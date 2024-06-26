const graphQLReq = `
{
    pools (orderBy: totalValueLockedETH, orderDirection:desc, first: 500) {
      id
      totalValueLockedETH
      token0Price
      token1Price
      feeTier
      token0 {id symbol name decimals}
      token1 {id symbol name decimals}
      }
  }`;

module.exports = graphQLReq;
