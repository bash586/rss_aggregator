import { addFeed } from "./src/lib/db/queries/feeds";

addFeed("test_debug", "http://testdebug", "9694f085-9703-4be6-af33-8573f5cf6bcb")
    .then(console.log)
    .catch(console.error)
    .finally(() => process.exit(0));
