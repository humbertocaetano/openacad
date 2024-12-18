ARG NODE_VERSION=18.19.0

FROM node:${NODE_VERSION}-alpine 

# Use production node environment by default.
ENV NODE_ENV development

RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app

WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.

# Copy the rest of the source files into the image.
COPY . .


RUN npm install
RUN npm install --save-dev @angular-devkit/build-angular --force -g
RUN npm install @angular/cli -g

RUN chmod -R 777 /usr/src/app
# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE 4200

# Run the application.
CMD ng serve --host 0.0.0.0
