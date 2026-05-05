// Done to remove errors by importing css files
declare module "*.css" {
  const content: string;
  export default content;
}
