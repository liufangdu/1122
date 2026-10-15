import random


def play_game() -> None:
    print("欢迎来到猜数字游戏！")
    secret_number = random.randint(1, 100)
    attempts = 0

    while True:
        print("请输入一个 1-100 之间的数字：")
        try:
            guess = int(input().strip())
        except EOFError:
            print("请输入结束，游戏退出。:")
            return
        except ValueError:
            print("输入无效，请输入整数。")
            continue

        if not 1 <= guess <= 100:
            print("数字必须在 1 到 100 之间，请重新输入。")
            continue

        attempts += 1
        if guess < secret_number:
            print("小了，再试一次。")
        elif guess > secret_number:
            print("大了，再试一次。")
        else:
            print(f"猜中了！答案是 {secret_number}，你一共猜了 {attempts} 次。")
            return


if __name__ == "__main__":
    play_game()
