# Use Node.js 20 for amd64 architecture
FROM --platform=linux/amd64 node:20

# Install Java 17 Zulu
RUN apt-get update && \
    apt-get install -y wget gnupg unzip build-essential python3 && \
    wget -qO - https://repos.azul.com/azul-repo.key | apt-key add - && \
    echo "deb https://repos.azul.com/zulu/deb stable main" | tee /etc/apt/sources.list.d/zulu.list && \
    apt-get update && \
    apt-get install -y zulu17-jdk

# Set JAVA_HOME environment variable
ENV JAVA_HOME=/usr/lib/jvm/zulu17

# Install Android SDK Command Line Tools
RUN mkdir -p /opt/android-sdk && \
    wget -O commandlinetools.zip https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip && \
    unzip commandlinetools.zip -d /opt/android-sdk/cmdline-tools && \
    rm commandlinetools.zip && \
    mv /opt/android-sdk/cmdline-tools/cmdline-tools /opt/android-sdk/cmdline-tools/latest

# Set Android SDK environment variables
ENV ANDROID_SDK_ROOT=/opt/android-sdk \
    PATH=$PATH:/opt/android-sdk/cmdline-tools/latest/bin:/opt/android-sdk/platform-tools:/opt/android-sdk/emulator:/opt/android-sdk/build-tools/35.0.0

# Accept licenses and install SDK packages
RUN yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" "platforms;android-35" "build-tools;35.0.0"

# Install project dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Build native modules
RUN npm rebuild

# Expose Metro Bundler port
EXPOSE 8081

# Start Metro Bundler
CMD ["npx", "react-native", "start", "--host", "0.0.0.0"]