<?php

namespace App\Tests\Utils\Struct;

use App\Entity\Category;
use App\Entity\Word;
use App\Utils\Struct\WordResponseStruct;
use PHPUnit\Framework\TestCase;

class WordResponseStructTest extends TestCase
{

    public function testMapFromWord()
    {
        $word = new Word();
        $word->setWord('igrzyska');

        $category = new Category();
        $category->setName('Sport');

        $word->setCategory($category);

        $wordResponse = WordResponseStruct::mapFromWord($word);
        $this->assertInstanceOf(WordResponseStruct::class, $wordResponse);
        $this->assertEquals('IGRZYSKA', $wordResponse->word);
        $this->assertEquals('Sport', $wordResponse->category);

    }
}
