FROM node:22-alpine as base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .


RUN npm run build


# FROM node:18-alpine AS production
# WORKDIR /app


# COPY --from=builder /app/package*.json ./

# RUN npm install --production


# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/next.config.js ./next.config.js

# ENV NODE_ENV production
# ENV PORT 3000
# EXPOSE 3000

# # start app in prod
# CMD ["npm", "start"]



FROM base AS development

WORKDIR /app

RUN npm install


# Set environment variables for development
ENV NODE_ENV development
ENV PORT 3000
EXPOSE 3000

CMD ["npm", "run", "dev"]

