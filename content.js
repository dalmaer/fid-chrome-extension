// guard against double-inclusion and making sure that the chrome runtime is available
if (
  typeof po == "undefined" &&
  typeof chrome.runtime == "object" &&
  typeof chrome.runtime.sendMessage == "function"
) {
  // Create the PerformanceObserver instance.
  const po = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      // Send the FID to the background page
      let fid = Math.round(entry.processingStart - entry.startTime);
      chrome.runtime.sendMessage({ result: fid });
      console.log("FID:", fid, "ms");
      // po.disconnect();
    }
  });

  // Observe entries of type `paint`, including buffered
  // entries, i.e. entries that occurred before calling `observe()`.
  po.observe({ type: "first-input", buffered: true });
}
