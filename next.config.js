module.exports = () => {
  return {
    compress: false,
    profiling: true,
    experimental: {
      workerThreads: true,
      modern: true,
    },
    poweredByHeader: false,
  };
};
