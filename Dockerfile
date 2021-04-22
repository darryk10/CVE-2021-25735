FROM node:14

# Create app directory
WORKDIR /usr/src/app

# where available (npm@5+)
COPY app/package*.json ./

RUN npm install
# Bundle app source
COPY app .

EXPOSE 8443
# Run as non-root user
USER 1000:1000
CMD [ "npm", "start" ]