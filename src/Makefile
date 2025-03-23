CXX = gcc
CXXFLAGS = -g -O3 -Wall -Wextra -Werror -Wpedantic
LDFLAGS = 
SRC = main.c
OUT = ../build/screw.elf

all: $(OUT)

$(OUT): $(SRC)
	$(CXX) $(CXXFLAGS) -o $(OUT) $(SRC) $(LDFLAGS)

clean:
	rm -f $(OUT)