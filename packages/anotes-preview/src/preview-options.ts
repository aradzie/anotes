export type PreviewOptions = {
  title: string;
  showDetails: boolean;
  showFront: boolean;
  showBack: boolean;
};

export function expandPreviewOptions(options: Partial<Readonly<PreviewOptions>>): PreviewOptions {
  const {
    title = "Cards Preview", //
    showDetails = true,
    showFront = false,
    showBack = true,
  } = options;
  return {
    title, //
    showDetails,
    showFront,
    showBack,
  };
}
