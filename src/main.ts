import 'source-map-support/register';
import './utils/dotenv';

if (require.main === module) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require(`./${process.argv[2]}/main`)
    .main()
    .then(() => {
      process.exit();
    })
    .catch((error: any) => {
      // eslint-disable-next-line no-console
      console.error(error);
      process.exit(1);
    });
} else {
  // Importing the main file will mess up source maps and other entrypoint initialization
  throw new Error('Do not import the main file.');
}
