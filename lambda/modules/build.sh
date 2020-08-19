# Remove old builds
rm -rf */node_modules
rm -rf node_modules
rm */package-lock.json
rm package-lock.json
rm */*.tgz

# PackLayers
cd database-driver
npm install --production --force
npm pack
cd ..

cd message-driver
npm install --production --force
npm pack
cd ..

cd schema-util
npm install --production --force
npm pack
cd ..

# Install Modules for Lambda Functions

cd action-handler
npm install --production --force
cd ..

cd dashboard
npm install --production --force
cd ..

cd information
npm install --production --force
cd ..

cd invoke
npm install --production --force
cd ..

cd notification-handler
npm install --production --force
cd ..

cd notify
npm install --production --force
cd ..

cd register
npm install --production --force
cd ..

cd submission
npm install --production --force
cd ..

cd subscription
npm install --production --force
cd ..

cd workflow-handler
npm install --production --force
cd ..

npm install
