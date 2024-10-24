# Use the official Node.js image as the base image
FROM node:20 AS build
# Set environment
ENV NODE_ENV=production
ENV DATABASE_URL=postgresql://expense-tracker-api_owner:t1arqGeBvcR3@ep-super-sun-a1t8j9p3.ap-southeast-1.aws.neon.tech/expense-tracker-api?sslmode=require
ENV REFRESH_SECRET_KEY=TUTEDg0AEji8SiWKJGCAlW/d+3x4uAYEsanDBXqlaOMUjpcoIK9ozf2tgedgZIdK9BEEh+yn21bI78aNXjE8kn82YcOd1cJimsgj
ENV ACCESS_SECRET_KEY=09vG3XEVN+TbJEwKWZ0Ulu1WARELNtJyjU+ILXUEIgvDEF2nIm09p8ZfceF0ebo/XyeChl4eWujqAc55Hi8zEVe7G7e7ggc0wO2
# Set the working directory inside the container
WORKDIR /usr/src/app
# Copy package.json and package-lock.json to the working directory
COPY package.json .
# Install the application dependencies
RUN yarn cache clean
RUN yarn --frozen-lockfile --network-timeout 100000
RUN yarn install
# Copy the rest of the application files
COPY . .
RUN npx prisma db push
RUN npx prisma generate
# Build the NestJS application
RUN yarn build

FROM node:lts-slim AS runner
WORKDIR /app
# Install linux package
RUN apt-get update && apt-get install openssl -y
# Copy folder from build to runner
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
# Change directory owner to node
RUN chown -R node:node /app
USER node
# Expose the application port
EXPOSE 3000
# Command to run the application
CMD ["node", "dist/main"]