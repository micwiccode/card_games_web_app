<?php


namespace App\Utils\Card;


class Card
{

    public $value;

    public $suit;


    /**
     * Card constructor.
     * @param $suit
     * @param $value
     */
    public function __construct($suit, $value)
    {
        $this->suit = $suit;
        $this->value = $value;
    }

    public function __toString()
    {
        return $this->value.$this->suit;
    }

    public static function getFromAlias(string $cardAlias)
    {
        $aliasArray = str_split('', $cardAlias);
        return new Card($aliasArray[0], $aliasArray[1]);
    }



}
