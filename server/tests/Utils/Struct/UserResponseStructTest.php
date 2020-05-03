<?php

namespace App\Tests\Utils\Struct;

use App\Entity\User;
use App\Utils\Struct\UserResponseStruct;
use PHPUnit\Framework\TestCase;


class UserResponseStructTest extends TestCase
{

    public function testMapFromUser()
    {
        $user = new User();
        $user->setEmail('maciek@bartosik.wtf');
        $user->setUsername('Maciek');
        $userResponse = UserResponseStruct::mapFromUser($user);
        $this->assertInstanceOf(UserResponseStruct::class, $userResponse);
        $this->assertEquals('maciek@bartosik.wtf', $userResponse->email);
        $this->assertEquals('Maciek', $userResponse->username);

    }
}
