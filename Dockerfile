FROM cypress/browsers:node-22.15.1-chrome-136.0.7103.113-1-ff-138.0.3-edge-136.0.3240.64-1

WORKDIR /e2e

COPY . .

RUN npm install
RUN npx cypress install
